from typing import Optional
from io import BytesIO
from PIL import Image
import numpy as np


class ImageProcessor:
    """Basic image validation and preprocessing helpers"""

    @staticmethod
    def validate_image(image_bytes: bytes) -> bool:
        try:
            with Image.open(BytesIO(image_bytes)) as img:
                img.verify()
            return True
        except Exception:
            return False

    @staticmethod
    def enhance_image_quality(image_bytes: bytes) -> bytes:
        # Placeholder: return original for now; hook for denoise/contrast
        return image_bytes

    @staticmethod
    def preprocess_for_crop_detection(image_bytes: bytes, size: tuple[int, int] = (224, 224)) -> np.ndarray:
        return ImageProcessor._preprocess_common(image_bytes, size)

    @staticmethod
    def preprocess_for_pest_detection(image_bytes: bytes, size: tuple[int, int] = (224, 224)) -> np.ndarray:
        return ImageProcessor._preprocess_common(image_bytes, size)

    @staticmethod
    def preprocess_for_soil_analysis(image_bytes: bytes, size: tuple[int, int] = (224, 224)) -> np.ndarray:
        return ImageProcessor._preprocess_common(image_bytes, size)

    @staticmethod
    def _preprocess_common(image_bytes: bytes, size: tuple[int, int]) -> np.ndarray:
        with Image.open(BytesIO(image_bytes)) as img:
            if img.mode != "RGB":
                img = img.convert("RGB")
            img = img.resize(size)
            arr = np.asarray(img, dtype=np.float32) / 255.0
            return np.expand_dims(arr, axis=0)

