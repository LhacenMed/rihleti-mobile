# Trips Implementation

This document describes the implementation of the trips functionality in the Rihleti mobile app.

## Overview

The trips system fetches available trips from the Supabase database based on departure and destination locations. It joins the `trips` and `routes` tables to provide comprehensive trip information.

## Database Schema

### Trips Table
```sql
create table public.trips (
  id uuid not null default gen_random_uuid (),
  agency_id uuid not null,
  vehicle_id uuid not null,
  route_id uuid not null,
  departure_time timestamp with time zone not null,
  arrival_time timestamp with time zone null,
  price numeric not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint trips_pkey primary key (id),
  constraint trips_agency_id_fkey foreign KEY (agency_id) references agencies (id) on delete CASCADE,
  constraint trips_route_id_fkey foreign KEY (route_id) references routes (id) on delete RESTRICT,
  constraint trips_vehicle_id_fkey foreign KEY (vehicle_id) references vehicles (id) on delete RESTRICT
);
```

### Routes Table
```sql
create table public.routes (
  id uuid not null default gen_random_uuid (),
  agency_id uuid not null,
  origin jsonb null,
  destination jsonb null,
  distance_km numeric null,
  duration interval null,
  created_at timestamp with time zone null default now(),
  name text not null default 'undefined'::text,
  constraint routes_pkey primary key (id),
  constraint routes_agency_id_fkey foreign KEY (agency_id) references agencies (id) on delete CASCADE
);
```

### Location JSONB Format
```json
{
  "lat": 18.088422664636212,
  "lng": -15.972040211557625,
  "address": "Nouakchott"
}
```

## Implementation Details

### 1. Types (`src/types/trips.ts`)
- `Route`: Defines the structure of a route with origin/destination coordinates and metadata
- `Trip`: Defines the structure of a trip with route reference
- `TripWithRoute`: Combined type for trips with full route information

### 2. Service Layer (`src/utils/trips-service.ts`)
- `fetchTripsByLocations()`: Main function to fetch trips based on locations
- Location matching using case-insensitive partial matching
- Only returns future trips (departure_time >= current time)
- Includes utility functions for formatting time, date, and price

### 3. UI Components
- `TripCard`: Displays individual trip information in a card format
- `TripsScreen`: Main screen that fetches and displays trips
- Loading states, error handling, and pull-to-refresh functionality

## Usage

### Basic Trip Fetching
```typescript
import { fetchTripsByLocations } from '@/utils/trips-service';

const trips = await fetchTripsByLocations('Nouakchott', 'Dakar');
```

### Displaying Trips
```typescript
import TripCard from '@/components/TripCard';

<TripCard 
  trip={trip} 
  onPress={(trip) => handleTripSelection(trip)} 
/>
```

## Features

- **Real-time Data**: Fetches live data from Supabase
- **Location Matching**: Flexible location matching using partial string matching
- **Future Trips Only**: Automatically filters out past trips
- **Responsive UI**: Dark/light theme support with Tailwind CSS
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Pull to Refresh**: Users can refresh the trip list
- **Loading States**: Smooth loading experience with spinners

## Location Matching Logic

The system uses a two-step approach:

1. **Route Search**: Find routes where either origin or destination contains the search terms
2. **Trip Filtering**: Filter trips to ensure both origin and destination match exactly

This allows for flexible location searching while maintaining accuracy.

## Future Enhancements

- Add filters for price range, departure time, and duration
- Implement trip booking functionality
- Add trip favorites and history
- Real-time updates for trip availability
- Integration with maps for route visualization
