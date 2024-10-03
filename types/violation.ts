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

// This is about the interval of the current date (hourly, daily, monthly, yearly)
// Will be used when we fetch data from a range of dates and we can get the data based on the interval
// Ex: If we need the hours where the violations happened, we can use the interval as "hourly"
export enum Interval {
  hourly = "hourly",
  daily = "daily",
  monthly = "monthly",
  yearly = "yearly",
}

export const IntervalEngToAr = {
  [Interval.hourly]: "ساعات",
  [Interval.daily]: "أيام",
  [Interval.monthly]: "شهور",
  [Interval.yearly]: "سنوات",
} as { [key in Interval]: string };

export const CurrentDateNounEngToAr = {
  [CurrentDate.day]: "اليوم",
  [CurrentDate.week]: "الأسبوع",
  [CurrentDate.month]: "الشهر",
  [CurrentDate.year]: "السنة",
} as { [key in CurrentDate]: string };

export const CurrentDateAdjEngToAr = {
  [CurrentDate.day]: "يومي",
  [CurrentDate.week]: "أسبوعي",
  [CurrentDate.month]: "شهري",
  [CurrentDate.year]: "سنوي",
} as { [key in CurrentDate]: string };

export const ViolationType = {
  overtakingfromleft: {
    en: "Overtaking From Left",
    ar: "التجاوز من اليسار",
  },
  overtakingfromright: {
    en: "Overtaking From Right",
    ar: "التجاوز من اليمين",
  },
};
