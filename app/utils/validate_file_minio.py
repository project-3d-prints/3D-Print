from fastapi import UploadFile, HTTPException
import os


ALLOWED_EXTENSIONS = {".stl", ".obj", ".3mf"}
MAX_FILE_SIZE = 100 * 1024 * 1024


async def validate_file_minio(file: UploadFile):
    """
    Функция валидации разрешения файла
    """

    if file:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Недопустимый формат файла. Допустимые форматы: .stl, .obj, .3mf",
            )

        file_data = await file.read()
        file_size = len(file_data)
        await file.seek(0)

        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="Файл слишком большой. Максимальный размер: 100 MB",
            )
