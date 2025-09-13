import { useLocalSearchParams } from "expo-router";
import TripsScreen from "@/app/screens/Trips";

export default function TripsRoute() {
  const { departure, destination } = useLocalSearchParams();
  
  // Create a mock route object to match the expected interface
  const route = {
    params: {
      departure: departure as string,
      destination: destination as string,
    },
  };
  
  return <TripsScreen route={route} />;
}
