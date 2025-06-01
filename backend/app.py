from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import base64, cv2, numpy as np
import time, logging
from ultralytics import YOLO

# ---------------------------------------------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------
# 1. Завантажуємо модель один раз при старті
MODEL_PATH = "best.pt"
try:
    model = YOLO(MODEL_PATH)
    CLASS_NAMES = model.names          # {0: "tank", 1: "apc", …}
except Exception as e:
    raise RuntimeError(f"❌ Не вдалося відкрити {MODEL_PATH}: {e}")

# ---------------------------------------------------------------
# 2. Логер для таймінгів
timelog = logging.getLogger("sivta.timing")
timelog.setLevel(logging.DEBUG)        # ← тепер видно DEBUG-рядки
if not timelog.handlers:
    timelog.addHandler(logging.StreamHandler())

@app.middleware("http")
async def timing_middleware(request, call_next):
    t0 = time.perf_counter()
    response = await call_next(request)
    dt = (time.perf_counter() - t0) * 1000
    timelog.info("⏱ %s %s %.1f ms", request.method, request.url.path, dt)
    return response

# ---------------------------------------------------------------
# 3. Мікрофункція для вимірювання етапів
def stamp(label: str):
    t0 = time.perf_counter()
    def _log():
        timelog.debug("⏱ %s %.2f ms", label, (time.perf_counter() - t0)*1000)
    return _log

# ---------------------------------------------------------------
def infer_image(img_bgr: np.ndarray):
    t_infer = stamp("infer")
    results = model(img_bgr, verbose=False)[0]
    t_infer()

    preds = []
    for i in range(len(results.boxes)):
        x1, y1, x2, y2 = results.boxes.xyxy[i].cpu().numpy()
        w, h           = x2 - x1, y2 - y1
        cx, cy         = x1 + w / 2, y1 + h / 2

        cls_idx = int(results.boxes.cls[i])
        conf    = float(results.boxes.conf[i])
        cls_name= CLASS_NAMES[cls_idx]

        preds.append({
            "x": float(cx), "y": float(cy),
            "width": float(w), "height": float(h),
            "class": cls_name, "confidence": conf
        })
    return preds, results.boxes.xyxy.cpu().numpy(), results.boxes.cls.cpu().numpy()

# ---------------------------------------------------------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    t_total = stamp("total")

    img_bytes = await file.read()
    if not img_bytes:
        raise HTTPException(400, "Empty file")

    # ---- 1) bytes → numpy → BGR
    t_decode = stamp("decode")
    img_np = np.frombuffer(img_bytes, np.uint8)
    img    = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
    t_decode()
    if img is None:
        raise HTTPException(400, "Not an image or broken file")

    # ---- 2) inference
    preds, xyxy, cls_ids = infer_image(img)

    # ---- 3) малюємо bbox
    t_draw = stamp("draw")
    for bbox, cls_idx in zip(xyxy.astype(int), cls_ids.astype(int)):
        x1, y1, x2, y2 = bbox
        label = CLASS_NAMES[cls_idx]
        cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 0), 2)
        cv2.putText(
            img, label, (x1, y1 - 6),
            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2, cv2.LINE_AA
        )
    t_draw()

    # ---- 4) назад у base64-PNG
    t_encode = stamp("encode")
    _, buf = cv2.imencode(".png", img)
    b64    = base64.b64encode(buf).decode()
    t_encode()

    t_total()
    return {
        "predictions": preds,
        "image"      : "data:image/png;base64," + b64,
    }
