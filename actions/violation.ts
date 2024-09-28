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

export async function getAllViolationsInRange({
  from,
  to,
}: {
  from: Date;
  to: Date;
}) {
  try {
    const data = await db.violations.findMany({
      where: {
        date: {
          gte: from,
          lte: to,
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
    from = subDays(startOfDay(to), 7);
  }

  if (current === CurrentDate.day) {
    from = startOfDay(to);
  }

  // 1- Group by street name
  const streetNameGroup = db.violations.groupBy({
    by: ["street_name"],
    where: {
      date: {
        gte: from,
        lte: to,
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
        gte: from,
        lte: to,
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
        gte: from,
        lte: to,
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
    currentFrom = startOfYear(new Date());
    currentTo = endOfDay(new Date());

    previousFrom = startOfYear(subYears(new Date(), 1));
    previousTo = endOfDay(subYears(new Date(), 1));
  }

  if (basedOn === CurrentDate.month) {
    currentFrom = startOfMonth(new Date());
    currentTo = endOfDay(new Date());

    previousFrom = startOfMonth(subMonths(new Date(), 1));
    previousTo = endOfDay(subMonths(endOfMonth(currentTo), 1));
  }

  if (basedOn === CurrentDate.week) {
    currentFrom = startOfWeek(new Date());
    currentTo = endOfDay(new Date());

    previousFrom = startOfWeek(subWeeks(new Date(), 1));
    previousTo = endOfDay(subWeeks(new Date(), 1));
  }

  if (basedOn === CurrentDate.day) {
    currentFrom = startOfDay(new Date());
    currentTo = endOfDay(new Date());

    previousFrom = startOfDay(subDays(new Date(), 1));
    previousTo = endOfDay(subDays(new Date(), 1));
  }

  const previous = db.violations.count({
    where: {
      date: {
        gte: previousFrom,
        lte: previousTo,
      },
    },
  });

  const current = db.violations.count({
    where: {
      date: {
        gte: currentFrom,
        lte: currentTo,
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
