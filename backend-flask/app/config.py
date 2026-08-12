"""Configuración del Servicio Principal de Juego (Flask).

La URL de la base de datos se toma de la variable de entorno DATABASE_URL.
Si no está definida se usa SQLite, para que cualquier integrante pueda
levantar el servicio sin instalar PostgreSQL.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

SQLITE_FALLBACK = f"sqlite:///{BASE_DIR / 'espol_quest_game.db'}"


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", SQLITE_FALLBACK)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False
    SERVICE_NAME = "espol-quest-game-service"
    SERVICE_VERSION = "0.1.0"
    # 5001 por defecto: en macOS el puerto 5000 lo ocupa AirPlay Receiver.
    PORT = int(os.getenv("PORT", 5001))
