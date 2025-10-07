import asyncio
from concurrent.futures import ThreadPoolExecutor
from minio import Minio
from minio import S3Error
from fastapi import HTTPException
import os
from datetime import timedelta
from dotenv import load_dotenv
import io

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))
executor = ThreadPoolExecutor()


class MinioClient:
    def __init__(self):
        self.client = Minio(
            endpoint=os.getenv("MINIO_ENDPOINT"),
            access_key=os.getenv("MINIO_ACCESS_KEY"),  # Ключ доступа
            secret_key=os.getenv("MINIO_SECRET_KEY"),  # СекретнFый ключ
            secure=os.getenv("MINIO_SECURE", "true").lower() == "true",
        )

        self.bucket_name = os.getenv("MINIO_BUCKET_NAME")

        # проверка на наличие бакета (пространство для хранения файлов) и создание в случае его отсутствия
        try:
            if not self.client.bucket_exists(self.bucket_name):
                self.client.make_bucket(self.bucket_name)
                print(f"Bucket {self.bucket_name} create")
        except S3Error as err:
            raise HTTPException(
                status_code=500, detail=f"Error of create bucket {str(err)}"
            )

    async def upload_file(self, file, file_name: str, user_id: int, job_id: int):
        try:
            object_name = f"user_{user_id}/job_{job_id}/{file_name}"
            file_data = await file.read()
            file_size = len(file_data)

            loop = asyncio.get_running_loop()
            await loop.run_in_executor(
                executor,
                lambda: self.client.put_object(
                    bucket_name=self.bucket_name,
                    object_name=object_name,
                    data=io.BytesIO(file_data),
                    length=file_size,
                    content_type="application/octet-stream",
                ),
            )

            await file.seek(0)
            return object_name
        except S3Error as err:
            raise HTTPException(
                status_code=500, detail=f"Ошибка загрузки файла в MinIO: {str(err)}"
            )

    def get_temporary_url(
        self, object_name: str, expires: timedelta = timedelta(minutes=30)
    ):
        try:
            url = self.client.presigned_get_object(
                bucket_name=self.bucket_name,
                object_name=object_name,
                expires=expires,
                response_headers={
                    "response-content-disposition": f'attachment; filename="{object_name.split("/")[-1]}"'
                },
            )
            return url
        except S3Error as err:
            raise HTTPException(
                status_code=500, detail=f"Ошибка генерации ссылки: {str(err)}"
            )


minio_client = MinioClient()
