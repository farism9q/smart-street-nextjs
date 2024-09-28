export type ViolationType = {
  _id: string;
  time: string;
  date: Date;
  license_plate_number: string;
  violation_type: string;
  vehicle_type: string;
  longitude: number;
  latitude: number;
  street_name: string;
};

export type ViolationStats = {
  streetName: {
    maxCount: number;
    maxStreets: string[];
  } | null;
  vehicleType: {
    maxCount: number;
    maxVehicles: string[];
  } | null;
  violationType: {
    maxCount: number;
    maxViolations: string[];
  } | null;
};

// This is about getting information based on the current date (daily, weekly, monthly, yearly)
export enum CurrentDate {
  day = "daily",
  week = "weekly",
  month = "monthly",
  year = "yearly",
}
