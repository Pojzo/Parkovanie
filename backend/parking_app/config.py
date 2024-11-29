import dotenv
import os

dotenv.load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 3406))
DB_USER = os.getenv("DB_USER", "dev_username")
DB_PASSWORD = os.getenv("DB_PASSWORD", "dev_password")
DB_NAME = os.getenv("DB_NAME", "parking")

MAX_RESERAVATION_TIME_HOURS = 4

version = "0.1.0"
