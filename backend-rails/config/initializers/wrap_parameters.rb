# El cuerpo JSON se lee tal cual llega. Sin esto Rails lo duplica bajo una clave
# con el nombre del controlador y ensucia el log con "Unpermitted parameter".
ActiveSupport.on_load(:action_controller) do
  wrap_parameters false
end
