Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "health", to: "health#show"

      # RF-01 escenario y fisicas 2D / RF-02 selector de niveles (Kevin Galvez)
      get  "levels",             to: "levels#index"
      get  "levels/:code",       to: "levels#show"
      post "levels/:code/state", to: "levels#save_state"
      get  "levels/:code/state", to: "levels#show_state"

      # RF-03 registro de respuestas / RF-04 catalogo de misiones (Jose Gavino)
      get  "levels/:code/missions",  to: "missions#index"
      get  "missions/:code",         to: "missions#show"
      post "missions/:code/answers", to: "missions#create_answer"

      # RF-05 progreso e insignias / RF-06 tabla de clasificacion (Jorge del Campo)
      post "progress",            to: "progress#create"
      get  "progress/:player_id", to: "progress#show"
      get  "ranking",             to: "ranking#index"

      get  "badges", to: "badges#index"

      get  "players",             to: "players#index"
      post "players",             to: "players#create"
      get  "players/:id/answers", to: "players#answers"
    end
  end
end
