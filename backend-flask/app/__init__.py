"""Servicio Principal de Juego - ESPOL Quest (Python 3 / Flask).

Expone la API REST que consume el motor de plataformas 2D (Phaser.js):
niveles y físicas (Kevin Gálvez) y misiones/trivias (José Gaviño).
"""
from flask import Flask, jsonify

from app.config import Config
from app.extensions import db


def create_app(config_object=Config):
    app = Flask(__name__)
    app.config.from_object(config_object)
    app.json.sort_keys = False          # respeta el orden de los diccionarios
    app.json.ensure_ascii = False       # tildes legibles en las respuestas JSON

    db.init_app(app)

    from app import models  # noqa: F401  (registra los modelos en el metadata)
    from app.routes.levels import bp as levels_bp
    from app.routes.missions import bp as missions_bp
    from app.routes.players import bp as players_bp

    app.register_blueprint(levels_bp)
    app.register_blueprint(missions_bp)
    app.register_blueprint(players_bp)

    @app.get("/api/v1/health")
    def health():
        engine = db.engine.url
        return jsonify({
            "service": app.config["SERVICE_NAME"],
            "version": app.config["SERVICE_VERSION"],
            "status": "ok",
            "database": f"{engine.drivername}://{engine.database}",
        })

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "recurso_no_encontrado"}), 404

    @app.errorhandler(405)
    def method_not_allowed(_):
        return jsonify({"error": "metodo_no_permitido"}), 405

    @app.errorhandler(500)
    def server_error(_):
        db.session.rollback()
        return jsonify({"error": "error_interno_del_servidor"}), 500

    with app.app_context():
        db.create_all()

    return app
