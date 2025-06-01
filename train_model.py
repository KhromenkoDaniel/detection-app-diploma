from ultralytics import YOLO

model = YOLO("yolo11n.pt")
model.train(
    data="./Diploma/datasets/combined_data.yaml",
    epochs=4,
    imgsz=512,
    batch=8,
    device='cpu',
    workers=6,
    project="runs/colab",
    name="military_detection"
)