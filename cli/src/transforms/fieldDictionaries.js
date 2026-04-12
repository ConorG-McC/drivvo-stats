export const FUEL_ES_TO_EN = {
  // top-level ids/meta
  id_abastecimento: "fuel_entry_id",
  id_unico: "unique_id",
  id_veiculo: "vehicle_id",
  id_usuario_acao: "user_action_id",

  // date/odo
  data: "date",
  odometro: "odometer",

  // amounts & prices (main + secondary fuels if present)
  valor_total: "total_cost",
  valor_total_dois: "total_cost_two",
  valor_total_tres: "total_cost_three",
  preco: "price_per_litre",
  preco_dois: "price_per_litre_two",
  preco_tres: "price_per_litre_three",

  // volumes
  litros: "litres", // if present in source
  volume: "volume",
  volume_dois: "volume_two",
  volume_tres: "volume_three",

  // fuel types (primary/secondary/tertiary)
  id_combustivel: "fuel_id",
  id_tipo_combustivel: "fuel_type_id",
  combustivel: "fuel_name",
  id_combustivel_dois: "fuel_id_two",
  id_tipo_combustivel_dois: "fuel_type_id_two",
  combustivel_dois: "fuel_name_two",
  id_combustivel_tres: "fuel_id_three",
  id_tipo_combustivel_tres: "fuel_type_id_three",
  combustivel_tres: "fuel_name_three",

  // flags
  tanque_cheio: "full_tank",
  tanque_cheio_dois: "full_tank_two",
  tanque_cheio_tres: "full_tank_three",
  esqueceu_anterior: "missed_previous_fill",
  sem_custo: "no_cost",
  sem_custo_dois: "no_cost_two",
  sem_custo_tres: "no_cost_three",

  // payment/driver/file/reason
  id_forma_pagamento: "payment_method_id",
  forma_pagamento: "payment_method",
  motorista: "driver",
  arquivo: "file",
  id_tipo_motivo: "reason_type_id",
  tipo_motivo: "reason_type",

  // station (nested object)
  posto_combustivel: "fuel_station",
  id_posto_combustivel: "fuel_station_id",
  nome: "name", // used inside nested objects like station
  endereco: "address",
  latitude: "latitude",
  longitude: "longitude",

  // notes/audit
  observacao: "notes",
  data_acao: "action_date",
  acao: "action",
};

export const SERVICE_ES_TO_EN = {
  id_servico: "service_id",
  id_unico: "unique_id",
  id_veiculo: "vehicle_id",
  id_usuario_acao: "user_action_id",

  // when/where
  data: "date",
  odometro: "odometer",
  id_local: "location_id",
  local: "location",

  // nested location fields
  nome: "name",
  endereco: "address",
  latitude: "latitude",
  longitude: "longitude",

  // payment
  id_forma_pagamento: "payment_method_id",
  forma_pagamento: "payment_method",

  // details
  motorista: "driver",
  arquivo: "file",
  observacao: "notes",

  // service line items array
  tipos_servico: "service_types",
  id_servico_tipo_servico: "service_line_item_id",
  id_tipo_servico: "service_type_id",
  valor: "amount",

  // audit
  data_acao: "action_date",
  acao: "action",
};

export const EXPENSE_ES_TO_EN = {
  id_despesa: "expense_id",
  id_unico: "unique_id",
  id_veiculo: "vehicle_id",
  id_usuario_acao: "user_action_id",
  id_motorista: 'driver_id',

  data: "date",
  odometro: "odometer",

  id_local: "location_id",
  local: "location",
  nome: "name",
  endereco: "address",
  latitude: "latitude",
  longitude: "longitude",

  id_forma_pagamento: "payment_method_id",
  forma_pagamento: "payment_method",

  id_tipo_motivo: "reason_type_id",
  tipo_motivo: "reason_type",

  id_arquivo: "file_id",
  arquivo: "file",

  valor_total: "total_cost",
  observacao: "notes",

  data_acao: "action_date",
  acao: "action",
};

export const VEHICLE_ES_TO_EN = {
  id_veiculo: "vehicle_id",
  id_unico: "unique_id",
  id_grupo: "group_id",
  id_usuario_acao: "user_action_id",

  id_tipo_veiculo: "vehicle_type_id",
  id_marca: "make_id",
  id_tipo_combustivel: "fuel_type_id",
  id_tipo_combustivel_dois: "fuel_type2_id",

  ativo: "active",
  nome: "vehicle_name",
  marca: "make",
  modelo: "model",
  placa: "plate",
  ano: "year",
  bicombustivel: "bi_fuel",

  volume_tanque: "tank_volume_litres",
  volume_tanque_dois: "tank_volume2_litres",
  principal: "primary",

  chassi: "chassis",
  renavam: "registration",
  unidade_distancia: "distance_unit",

  observacao: "notes",
  data_acao: "action_date",
  acao: "action",
};
