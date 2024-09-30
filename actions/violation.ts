"use server";

import { CurrentDate } from "@/types/violation";
import {
  startOfDay,
  startOfMonth,
  startOfYear,
  endOfDay,
  subYears,
  subDays,
  startOfWeek,
  subWeeks,
  subMonths,
  endOfMonth,
  format,
  addDays,
  endOfYear,
} from "date-fns";
import { db } from "@/lib/db";

export async function getAllViolation() {
  try {
    const data = await db.violations.findMany({
      select: {
        id: true,
        date: true,
        time: true,
        license_plate_number: true,
        violation_type: true,
        vehicle_type: true,
        longitude: true,
        latitude: true,
        street_name: true,
      },
    });

    return data;
  } catch (error: any) {
    throw new Error("Error fetching violations");
  }
}

// This function will be used in the dashboard to display the violations in a specific range
// ------------------------------
// Accepts two parameters: from and to of type string
// Returns all the violations recorded between the two dates
export async function getAllViolationsInRange({
  from,
  to,
}: {
  from: Date;
  to: Date;
}) {
  try {
    const fromStr = format(from, "yyyy-MM-dd");
    const toStr = format(to, "yyyy-MM-dd");

    const data = await db.violations.findMany({
      where: {
        date: {
          gte: fromStr,
          lte: toStr,
        },
      },
    });

    return data;
  } catch (error: any) {
    throw new Error("Error fetching violations");
  }
}

// This function will return the steet, vehicle and violation value that have the highest number of violations
// This function will be used to display the statistics in the dashboard (As cards)
// ------------------------------
// Accepts one parameter: current of type CurrentDate
// Returns the street name, vehicle type, and violation type with the highest number of violations
export async function getViolationsStats({
  current,
}: {
  current: CurrentDate;
}) {
  const to = new Date();
  let from = startOfDay(to);

  if (current === CurrentDate.year) {
    from = startOfYear(to);
  }

  if (current === CurrentDate.month) {
    from = startOfMonth(to);
  }

  if (current === CurrentDate.week) {
    // In Saudi Arabia, Saturday is the first day of the week, but this function assumes that Sunday is the first day of the week
    // so we need to get the end of the week to be Saturday
    from = subDays(startOfWeek(new Date()), 1);
  }

  if (current === CurrentDate.day) {
    from = startOfDay(to);
  }

  const fromStr = format(from, "yyyy-MM-dd");
  const toStr = format(to, "yyyy-MM-dd");

  // 1- Group by street name
  const streetNameGroup = db.violations.groupBy({
    by: ["street_name"],
    where: {
      date: {
        gte: fromStr,
        lte: toStr,
      },
    },
    _count: {
      street_name: true,
      date: true,
    },
    orderBy: {
      _count: {
        street_name: "desc",
      },
    },

    _max: {
      street_name: true,
    },
  });

  // 2- Group by vehicle type
  const vehicleTypeGroup = db.violations.groupBy({
    by: ["vehicle_type"],
    where: {
      date: {
        gte: fromStr,
        lte: toStr,
      },
    },
    _count: {
      vehicle_type: true,
      date: true,
    },
    orderBy: {
      _count: {
        vehicle_type: "desc",
      },
    },
    _max: {
      vehicle_type: true,
    },
  });

  // 3- Group by violation type
  const violationTypeGroup = db.violations.groupBy({
    by: ["violation_type"],
    where: {
      date: {
        gte: fromStr,
        lte: toStr,
      },
    },
    _count: {
      violation_type: true,
      date: true,
    },
    orderBy: {
      _count: {
        violation_type: "desc",
      },
    },
    _max: {
      violation_type: true,
    },
  });

  // Execute the three queries in parallel since they are not dependent on each other
  // This will improve the performance of the function
  const [streetName, vehicleType, violationType] = await db.$transaction([
    streetNameGroup,
    vehicleTypeGroup,
    violationTypeGroup,
  ]);

  // Find the maximum count of violations
  const streetMaxCount =
    streetName.length > 0
      ? Math.max(...streetName.map(v => v._count.street_name))
      : 0;
  const vehicleMaxCount =
    vehicleType.length > 0
      ? Math.max(...vehicleType.map(v => v._count.vehicle_type))
      : 0;
  const violationMaxCount =
    violationType.length > 0
      ? Math.max(...violationType.map(v => v._count.violation_type))
      : 0;

  // Filter the grouped results to include only those with the maximum count
  const streetMaxViolation =
    streetName.length > 0
      ? streetName.filter(v => v._count.street_name === streetMaxCount)
      : [];
  const vehicleMaxViolation =
    vehicleType.length > 0
      ? vehicleType.filter(v => v._count.vehicle_type === vehicleMaxCount)
      : [];
  const violationMaxViolation =
    violationType.length > 0
      ? violationType.filter(v => v._count.violation_type === violationMaxCount)
      : [];

  return {
    streetName: {
      maxCount: streetMaxCount,
      maxStreets: streetMaxViolation.map(v => v._max.street_name) as string[],
    },
    vehicleType: {
      maxCount: vehicleMaxCount,
      maxVehicles: vehicleMaxViolation.map(
        v => v._max.vehicle_type
      ) as string[],
    },
    violationType: {
      maxCount: violationMaxCount,
      maxViolations: violationMaxViolation.map(
        v => v._max.violation_type
      ) as string[],
    },
  };
}

// This function is used to compare the total number of violations based on the year, month, week, and day
// If day is passed (The default), it will compare the current day and previous day
// If month is passed, it will compare the current month and previous month
// If week is passed, it will compare the current week and previous week
// If year is passed, it will compare the current year and previous year
// ------------------------------
// Accepts one parameter: basedOn of type CurrentDate
// Returns the total number of violations for the current and previous period based on the passed parameter
// EXAMPLE: If basedOn is CurrentDate.day, it will return the total number of violations for the current day and previous day
export async function getComparionOfTotalNbViolations({
  basedOn = CurrentDate.day,
}: {
  basedOn: CurrentDate;
}) {
  // DEFAULT
  let currentFrom = startOfDay(new Date());
  let currentTo = endOfDay(new Date());

  let previousFrom = startOfDay(subDays(new Date(), 1));
  let previousTo = endOfDay(subDays(new Date(), 1));

  if (basedOn === CurrentDate.year) {
    // From the first day of current year to today
    currentFrom = startOfYear(new Date());
    currentTo = endOfDay(new Date());

    // From the first day of the previous year to the last day of the previous year
    previousFrom = startOfYear(subYears(new Date(), 1));
    previousTo = endOfYear(previousFrom); // Same as endOfDay(endOfYear(subYears(new Date(), 1)))
  }

  if (basedOn === CurrentDate.month) {
    // From the first day of the current month to today
    currentFrom = startOfMonth(new Date());
    currentTo = endOfDay(new Date());

    // From the first day of the previous month to the last day of the previous month
    previousFrom = startOfMonth(subMonths(new Date(), 1));
    previousTo = endOfMonth(subMonths(currentTo, 1));
  }

  if (basedOn === CurrentDate.week) {
    // In Saudi Arabia Saturday is the first day of the week, but this function assumes that Sunday is the first day of the week
    // so we need to get the end of the week to be Saturday
    // Same with the end of the week, Friday is the last day of the week, but this function assumes that Saturday is the last day of the week
    // so we need to get the end of the week to be Friday

    // From the first day of the current week to today
    currentFrom = subDays(startOfWeek(new Date()), 1);
    currentTo = endOfDay(new Date());

    // From the first day of the previous week to the last day of the previous week
    previousFrom = subDays(startOfWeek(subWeeks(new Date(), 1)), 1);
    previousTo = addDays(previousFrom, 6);
  }

  if (basedOn === CurrentDate.day) {
    // 30-09 - 30-09
    currentFrom = startOfDay(new Date());
    currentTo = endOfDay(new Date());

    // 29-09 - 29-09
    previousFrom = startOfDay(subDays(new Date(), 1));
    previousTo = endOfDay(subDays(new Date(), 1));
  }

  const previousFromStr = format(previousFrom, "yyyy-MM-dd");
  const previousToStr = format(previousTo, "yyyy-MM-dd");

  const previous = db.violations.count({
    where: {
      date: {
        gte: previousFromStr,
        lte: previousToStr,
      },
    },
  });

  const currentFromStr = format(currentFrom, "yyyy-MM-dd");
  const currentToStr = format(currentTo, "yyyy-MM-dd");

  const current = db.violations.count({
    where: {
      date: {
        gte: currentFromStr,
        lte: currentToStr,
      },
    },
  });

  const [previousData, currentData] = await db.$transaction([
    previous,
    current,
  ]);

  return {
    current: currentData,
    previous: previousData,
  };
}

// This function will return the total number of violations recorded in the specified year
// ------------------------------
// Accepts one parameter: year of type number
// Returns the total number of violations recorded in the specified year
export async function getTotalViolationsBasedOnYear(year: number) {
  const from = startOfYear(new Date(year, 0, 1));
  const to = endOfDay(new Date(year, 11, 31));

  const fromStr = format(from, "yyyy-MM-dd");
  const toStr = format(to, "yyyy-MM-dd");

  const data = db.violations.count({
    where: {
      date: {
        // Current year is 2024, but this function will return 2023-01-01 00:00:00 to 2023-12-31 23:59:59, which means the end of 2023 and are about to start 2024.
        // But in our case, we only have the date like 2024-01-01, so we need to get the date that are greater than 2023-12-31 23:59:59
        gt: fromStr,
        lte: toStr,
      },
    },
  });

  return data;
}

// This function will return the highest number of violations recorded in a day,
// along with the street name, vehicle type, and violation type that recorded the highest number of violations
// ------------------------------
// Returns the total number of violations recorded in the current year,
// the highest number of violations recorded in a day, and the stats of the violations in the current year
// The stats include the street name, vehicle type, and violation type with the highest number of violations
export async function getSummaryOfCurrentYear() {
  const from = startOfYear(new Date());
  const to = endOfDay(new Date());

  const fromStr = format(from, "yyyy-MM-dd");
  const toStr = format(to, "yyyy-MM-dd");

  const highestViolationsOnDay = db.violations.groupBy({
    by: ["date"],
    where: {
      date: {
        gt: fromStr,
        lte: toStr,
      },
    },
    _count: {
      date: true,
    },
    orderBy: {
      _count: {
        date: "desc",
      },
    },
    _max: {
      date: true,
    },
  });

  const [totalViolations, violationsStats, highestViolatedDay] =
    await Promise.all([
      getTotalViolationsBasedOnYear(new Date().getFullYear()),
      getViolationsStats({ current: CurrentDate.year }),
      highestViolationsOnDay,
    ]);

  return {
    totalViolations,
    violationsStats,
    highestViolatedDay: {
      day: highestViolatedDay[0]._max.date,
      count: highestViolatedDay[0]._count.date,
    },
  };
}
