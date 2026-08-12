Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      get  "health",  to: "health#show"

      # RF-05 Registrar progreso e insignias del jugador (Jorge del Campo)
      post "progress",              to: "progress#create"
      get  "progress/:player_id",   to: "progress#show"

      # RF-06 Consultar tabla de clasificación (Jorge del Campo)
      get  "ranking", to: "ranking#index"

      get  "badges",  to: "badges#index"
    end
  end
end
