export interface FuelEntry {
  fuel_entry_id: number;
  date: string;
  odometer: number;
  total_cost: number;
  total_cost_two?: number;
  total_cost_three?: number;
  price_per_litre: number;
  price_per_litre_two?: number;
  price_per_litre_three?: number;
  litres?: number | null;
  volume?: number | null;
  volume_two?: number | null;
  volume_three?: number | null;
  fuel_name?: string | null;
  fuel_name_two?: string | null;
  fuel_name_three?: string | null;
  full_tank: boolean;
  full_tank_two?: boolean;
  full_tank_three?: boolean;
  missed_previous_fill: boolean;
  no_cost?: boolean;
  payment_method?: string | null;
  notes?: string | null;
  fuel_station?: { name: string };
}

export interface ServiceEntry {
  service_id: number;
  date: string;
  odometer: number;
  location?: { name: string };
  notes?: string;
  service_types: { name: string; amount: number | null }[];
}
