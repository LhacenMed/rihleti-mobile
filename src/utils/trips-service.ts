import { supabase } from "../lib/supabase";
import { TripWithRoute } from "../types/trips";

/**
 * Fetches trips based on origin and destination addresses
 * @param originAddress - The departure address to search for
 * @param destinationAddress - The destination address to search for
 * @returns Promise<TripWithRoute[]> - Array of trips with route information
 */
export const fetchTripsByLocations = async (
  originAddress: string,
  destinationAddress: string
): Promise<TripWithRoute[]> => {
  try {
    // Query trips with their associated routes, filtering by origin and destination addresses
    const { data, error } = await supabase
      .from("trips")
      .select(
        `
        *,
        routes!inner (
          id,
          agency_id,
          origin,
          destination,
          distance_km,
          duration,
          created_at,
          name
        )
      `
      )
      .ilike("routes.origin->>address", `%${originAddress}%`)
      .ilike("routes.destination->>address", `%${destinationAddress}%`)
      .order("departure_time", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch trips: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data to match TripWithRoute type
    const tripsWithRoutes: TripWithRoute[] = data.map((trip) => ({
      ...trip,
      // Add route data directly to the trip object for easier access
      origin: trip.routes.origin,
      destination: trip.routes.destination,
      distance_km: trip.routes.distance_km,
      duration: trip.routes.duration,
      route_name: trip.routes.name,
      // Keep the full route object as well
      route: trip.routes,
    }));

    return tripsWithRoutes;
  } catch (error) {
    console.error("Error in fetchTripsByLocations:", error);
    throw error;
  }
};

/**
 * Alternative function with exact address matching (case-insensitive)
 * Use this if you want more precise matching
 */
export const fetchTripsByExactLocations = async (
  originAddress: string,
  destinationAddress: string
): Promise<TripWithRoute[]> => {
  try {
    const { data, error } = await supabase
      .from("trips")
      .select(
        `
        *,
        routes!inner (
          id,
          agency_id,
          origin,
          destination,
          distance_km,
          duration,
          created_at,
          name
        )
      `
      )
      .ilike("routes.origin->>address", originAddress)
      .ilike("routes.destination->>address", destinationAddress)
      .order("departure_time", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch trips: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    const tripsWithRoutes: TripWithRoute[] = data.map((trip) => ({
      ...trip,
      origin: trip.routes.origin,
      destination: trip.routes.destination,
      distance_km: trip.routes.distance_km,
      duration: trip.routes.duration,
      route_name: trip.routes.name,
      route: trip.routes,
    }));

    return tripsWithRoutes;
  } catch (error) {
    console.error("Error in fetchTripsByExactLocations:", error);
    throw error;
  }
};

/**
 * Function to search trips by coordinates with radius (for location-based search)
 * This is useful if you want to find trips near specific coordinates
 */
export const fetchTripsByCoordinates = async (
  originLat: number,
  originLng: number,
  destinationLat: number,
  destinationLng: number,
  radiusKm: number = 10 // Default 10km radius
): Promise<TripWithRoute[]> => {
  try {
    // Note: This is a simplified approach. For production, you might want to use PostGIS
    // or implement a more sophisticated geographical search
    const { data, error } = await supabase
      .from("trips")
      .select(
        `
        *,
        routes!inner (
          id,
          agency_id,
          origin,
          destination,
          distance_km,
          duration,
          created_at,
          name
        )
      `
      )
      .gte("routes.origin->>lat", originLat - radiusKm / 111) // Rough conversion: 1 degree ≈ 111km
      .lte("routes.origin->>lat", originLat + radiusKm / 111)
      .gte("routes.origin->>lng", originLng - radiusKm / 111)
      .lte("routes.origin->>lng", originLng + radiusKm / 111)
      .gte("routes.destination->>lat", destinationLat - radiusKm / 111)
      .lte("routes.destination->>lat", destinationLat + radiusKm / 111)
      .gte("routes.destination->>lng", destinationLng - radiusKm / 111)
      .lte("routes.destination->>lng", destinationLng + radiusKm / 111)
      .order("departure_time", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch trips: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    const tripsWithRoutes: TripWithRoute[] = data.map((trip) => ({
      ...trip,
      origin: trip.routes.origin,
      destination: trip.routes.destination,
      distance_km: trip.routes.distance_km,
      duration: trip.routes.duration,
      route_name: trip.routes.name,
      route: trip.routes,
    }));

    return tripsWithRoutes;
  } catch (error) {
    console.error("Error in fetchTripsByCoordinates:", error);
    throw error;
  }
};

/**
 * Helper function to get all unique locations (for autocomplete/suggestions)
 */
export const getAllLocations = async (): Promise<{ origins: string[]; destinations: string[] }> => {
  try {
    const { data, error } = await supabase.from("routes").select("origin, destination");

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch locations: ${error.message}`);
    }

    const origins = new Set<string>();
    const destinations = new Set<string>();

    data?.forEach((route) => {
      if (route.origin?.address) {
        origins.add(route.origin.address);
      }
      if (route.destination?.address) {
        destinations.add(route.destination.address);
      }
    });

    return {
      origins: Array.from(origins).sort(),
      destinations: Array.from(destinations).sort(),
    };
  } catch (error) {
    console.error("Error in getAllLocations:", error);
    throw error;
  }
};

export const formatTripTime = (timeString: string): string => {
  try {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      console.warn("⚠️ Invalid date string provided to formatTripTime:", timeString);
      return "Invalid time";
    }
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("❌ Error formatting trip time:", error);
    return "Invalid time";
  }
};

export const formatTripDate = (timeString: string): string => {
  try {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      console.warn("⚠️ Invalid date string provided to formatTripDate:", timeString);
      return "Invalid date";
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("❌ Error formatting trip date:", error);
    return "Invalid date";
  }
};

export const formatPrice = (price: number): string => {
  try {
    if (typeof price !== "number" || isNaN(price)) {
      console.warn("⚠️ Invalid price provided to formatPrice:", price);
      return "$0.00";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  } catch (error) {
    console.error("❌ Error formatting price:", error);
    return "$0.00";
  }
};
