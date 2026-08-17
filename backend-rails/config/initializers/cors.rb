# El frontend se sirve desde otro origen (Vite en :5173), asi que sin estas
# cabeceras el navegador bloquea todas las peticiones.
#
# Los origenes permitidos salen de FRONTEND_ORIGINS, separados por coma, para no
# tener que tocar codigo al cambiar de puerto o al desplegar.
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("FRONTEND_ORIGINS") { "http://localhost:5173,http://127.0.0.1:5173" }
              .split(",").map(&:strip)

    resource "/api/*",
             headers: :any,
             methods: %i[get post patch put delete options head]
  end
end
