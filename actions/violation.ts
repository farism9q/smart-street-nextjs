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

    console.log("I am an agent accessing the database. [getAllViolation]");

    return data;
  } catch (error: any) {
    throw new Error("Error fetching violations");
  }
}

// This function will be used in the dashboard to display the violations in a specific range
// Not used in the chatbot
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

    console.log(
      "I am an agent accessing the database. [getAllViolationsInRange]"
    );

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
    from = startOfWeek(to);
  }

  if (current === CurrentDate.day) {
    from = startOfDay(to);
  }

  console.log("I am an agent accessing the database. [getViolationStats]");

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

  console.log(
    "I am an agent accessing the database. [getComparionOfTotalNbViolations]"
  );

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

// This function will return the total number of violations recorded in the specified year
export async function getTotalViolationsBasedOnYear(year: number) {
  const from = startOfYear(new Date(year, 0, 1));
  const to = endOfDay(new Date(year, 11, 31));

  console.log(
    "I am an agent accessing the database. [getTotalViolationsBasedOnYear]"
  );

  const data = db.violations.count({
    where: {
      date: {
        gte: from,
        lte: to,
      },
    },
  });

  return data;
}

// This function will return the highest number of violations recorded in a day,
// along with the street name, vehicle type, and violation type that recorded the highest number of violations
export async function getSummaryOfCurrentYear() {
  const from = startOfYear(new Date());
  const to = endOfDay(new Date());

  console.log(
    "I am an agent accessing the database. [getSummaryOfCurrentYear]"
  );

  const highestViolationsOnDay = db.violations.groupBy({
    by: ["date"],
    where: {
      date: {
        gte: from,
        lte: to,
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

// This function will return the year, month, and day with the highest number of violations from all the recorded violations
// So not only the current year, but all the years
export async function getHighestViolationsYearMonthDay() {
  console.log(
    "I am an agent accessing the database. [getHighestViolationsYearMonthDay]"
  );

  const data = await db.violations.groupBy({
    by: ["date"],
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

  return data;
}
