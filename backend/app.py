# app.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests, base64, cv2, numpy as np

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

API_KEY   = "e0hLCoCenDSJPZVBrbaE"
MODEL_ID  = "tank_detection-qxeox"
MODEL_VER = "1"
BASE_URL  = f"https://detect.roboflow.com/{MODEL_ID}/{MODEL_VER}"

def roboflow_request(fmt: str, img_bytes: bytes):
    resp = requests.post(
        BASE_URL,
        params={"api_key": API_KEY, "format": fmt},
        files={"file": img_bytes},
        timeout=30,
    )
    if resp.status_code != 200:
        raise HTTPException(resp.status_code, resp.text)
    return resp

@app.post("/predict")
async def analyze(file: UploadFile = File(...)):
    img_bytes = await file.read()
    if not img_bytes:
        raise HTTPException(400, "Empty file")

    # 1) JSON із prediction'ами
    data = roboflow_request("json", img_bytes).json()

    # 2) Декодуємо оригінал у BGR‑масив
    img_np = np.frombuffer(img_bytes, np.uint8)
    img     = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

    # 3) Малюємо bbox + label
    for p in data["predictions"]:
        x, y, w, h   = p["x"], p["y"], p["width"], p["height"]
        cls, conf    = p["class"], p["confidence"]

        x1, y1 = int(x - w / 2), int(y - h / 2)
        x2, y2 = int(x + w / 2), int(y + h / 2)

        cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 0), 2)
        label = f"{cls} {conf:.2f}"
        cv2.putText(
            img,
            label,
            (x1, y1 - 8),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 0, 0),
            2,
            cv2.LINE_AA,
        )

    # 4) PNG → base64 → dataURI
    _, buf   = cv2.imencode(".png", img)
    b64      = base64.b64encode(buf).decode()
    data["image"] = "data:image/png;base64," + b64

    return data
