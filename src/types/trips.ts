export type Route = {
  id: string;
  agency_id: string;
  origin: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  distance_km: number | null;
  duration: string | null;
  created_at: string | null;
  name: string;
};

export type Trip = {
  id: string;
  agency_id: string;
  vehicle_id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string | null;
  price: number;
  created_at: string | null;
  updated_at: string | null;
  origin: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  destination: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  route?: Route;
};

export type TripWithRoute = Trip & {
  route: Route | null;
};
