from dotenv import load_dotenv, find_dotenv
from src.settings import get_connection
import os

dotenv_file = find_dotenv()
load_dotenv(dotenv_file)

HOST = os.getenv("HOST", "0.0.0.0")
PORT = os.getenv("PORT", "8000")
RELOAD = os.getenv("RELOAD", True)

# Henrique Agostinetto Piva