import { useLocalSearchParams } from "expo-router";
import TripDetailsScreen from "@/app/screens/TripDetails";

export default function TripDetailsRoute() {
  const { tripId } = useLocalSearchParams();
  
  // Create a mock route object to match the expected interface
  const route = {
    params: {
      tripId: tripId as string,
    },
  };
  
  return <TripDetailsScreen route={route} />;
}
