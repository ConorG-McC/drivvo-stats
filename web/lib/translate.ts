type Dictionary = Record<string, string>;

export function renameKeysDeep(value: unknown, dictionary: Dictionary): unknown {
  if (Array.isArray(value)) return value.map(item => renameKeysDeep(item, dictionary));
  if (value && typeof value === "object" && value.constructor === Object) {
    const output: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      output[dictionary[key] ?? key] = renameKeysDeep(val, dictionary);
    }
    return output;
  }
  return value;
}

export const FUEL_ES_TO_EN: Dictionary = {
  id_abastecimento: "fuel_entry_id", id_unico: "unique_id", id_veiculo: "vehicle_id",
  id_usuario_acao: "user_action_id", data: "date", odometro: "odometer",
  valor_total: "total_cost", valor_total_dois: "total_cost_two", valor_total_tres: "total_cost_three",
  preco: "price_per_litre", preco_dois: "price_per_litre_two", preco_tres: "price_per_litre_three",
  litros: "litres", volume: "volume", volume_dois: "volume_two", volume_tres: "volume_three",
  id_combustivel: "fuel_id", id_tipo_combustivel: "fuel_type_id", combustivel: "fuel_name",
  id_combustivel_dois: "fuel_id_two", id_tipo_combustivel_dois: "fuel_type_id_two", combustivel_dois: "fuel_name_two",
  id_combustivel_tres: "fuel_id_three", id_tipo_combustivel_tres: "fuel_type_id_three", combustivel_tres: "fuel_name_three",
  tanque_cheio: "full_tank", tanque_cheio_dois: "full_tank_two", tanque_cheio_tres: "full_tank_three",
  esqueceu_anterior: "missed_previous_fill",
  sem_custo: "no_cost", sem_custo_dois: "no_cost_two", sem_custo_tres: "no_cost_three",
  id_forma_pagamento: "payment_method_id", forma_pagamento: "payment_method",
  arquivo: "file", id_tipo_motivo: "reason_type_id", tipo_motivo: "reason_type",
  posto_combustivel: "fuel_station", id_posto_combustivel: "fuel_station_id",
  nome: "name", endereco: "address", latitude: "latitude", longitude: "longitude",
  observacao: "notes", data_acao: "action_date", acao: "action",
  arquivos: "arquivos", motorista: "driver",
};

export const SERVICE_ES_TO_EN: Dictionary = {
  id_servico: "service_id", id_unico: "unique_id", id_veiculo: "vehicle_id",
  id_usuario_acao: "user_action_id", data: "date", odometro: "odometer",
  id_local: "location_id", local: "location", nome: "name", endereco: "address",
  latitude: "latitude", longitude: "longitude", id_forma_pagamento: "payment_method_id",
  forma_pagamento: "payment_method", motorista: "driver", observacao: "notes",
  tipos_servico: "service_types", id_servico_tipo_servico: "service_line_item_id",
  id_tipo_servico: "service_type_id", valor: "amount",
  data_acao: "action_date", acao: "action", arquivos: "arquivos",
};
