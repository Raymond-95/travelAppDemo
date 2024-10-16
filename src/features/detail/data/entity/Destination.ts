interface Location {
  latitude: number;
  longitude: number;
}

export interface Destination {
  name: string;
  location: Location;
  image: string;
  description: string;
  suggestedTravelDates: string[];
}
