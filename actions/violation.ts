"use server";

import { CurrentDate, Interval } from "@/types/violation";
import {
  startOfDay,
  startOfMonth,
  startOfYear,
  endOfDay,
  subDays,
  startOfWeek,
  subWeeks,
  subMonths,
  endOfMonth,
  format,
  addDays,
  endOfYear,
  endOfWeek,
} from "date-fns";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

/**
 * Returns all the violations recorded in the database.
 * @returns {Promise<any[]>} All the violations recorded in the database.
 */
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
/**
 *
 * @param {Date | string} from
 * @param {Date | string} to
 * @param {boolean} dateFromFrontend required to fix the date issue from the frontend (date is one day behind)
 * @returns {Promise<any[]>} All the violations recorded between the two dates
 */
export async function getAllViolationsInRange({
  from,
  to,
  dateFromFrontend,
  action,
}: {
  from: Date | string;
  to: Date | string;
  dateFromFrontend: boolean;
  action?: {
    retreiveCount?: boolean;
    summary?: boolean;
  };
}) {
  try {
    // Date sent from the frontend are one day behind, so we need to add one day to the to date
    // But in the backend, the date is correct.
    if (dateFromFrontend && process.env.NODE_ENV !== "development") {
      from = addDays(new Date(from), 1);
      to = addDays(new Date(to), 1);
    }

    const fromStr = format(from, "yyyy-MM-dd");
    const toStr = format(to, "yyyy-MM-dd");

    if (action?.retreiveCount) {
      const data = await db.violations.count({
        where: {
          date: {
            gte: fromStr,
            lte: toStr,
          },
        },
      });
      return data;
    }

    if (action?.summary) {
      const year =
        from instanceof Date
          ? from.getFullYear()
          : new Date(from).getFullYear();
      const month =
        from instanceof Date
          ? from.getMonth() + 1
          : new Date(from).getMonth() + 1;
      const day =
        from instanceof Date ? from.getDate() : new Date(from).getDate();
      const data = await getViolationsSummaryBasedOnDate({
        year,
        month,
        day,
      });

      return data;
    }

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

// This function is used to compare the total number of violations based on the year, month, week, and day
/**
 *
 * @param {CurrentDate} basedOn Optional The period to compare the total number of violations based on the year, month, week, and day
 * @default CurrentDate.day
 * @returns {Promise<{current: number, previous: number}>} The total number of violations for the current and previous period based on the passed parameter
 * @example getComparionOfTotalNbViolations({ basedOn: CurrentDate.day }) // Returns the total number of violations for the current day and previous day
 * @example getComparionOfTotalNbViolations({ basedOn: CurrentDate.week }) // Returns the total number of violations for the current week and previous week
 */
export async function getComparionOfTotalNbViolations({
  basedOn = CurrentDate.day,
}: {
  basedOn: CurrentDate;
}) {
  // DEFAULT
  let currentFrom = startOfDay(formatDate(new Date()));
  let currentTo = endOfDay(formatDate(new Date()));

  let previousFrom = startOfDay(subDays(formatDate(new Date()), 1));
  let previousTo = endOfDay(subDays(formatDate(new Date()), 1));

  if (basedOn === CurrentDate.year) {
    // From the first day of current year to today
    currentFrom = startOfYear(formatDate(new Date()));
    currentTo = endOfDay(formatDate(new Date()));

    // From the first day of the previous year to the last day of the previous year
    previousFrom = endOfYear(subDays(formatDate(new Date()), 1));
    previousTo = endOfYear(formatDate(previousFrom)); // Same as endOfDay(endOfYear(subYears(new Date(), 1)))
  }

  if (basedOn === CurrentDate.month) {
    // From the first day of the current month to today
    currentFrom = startOfMonth(formatDate(new Date()));
    currentTo = endOfDay(formatDate(new Date()));

    // From the first day of the previous month to the last day of the previous month
    previousFrom = startOfMonth(subMonths(formatDate(new Date()), 1));
    previousTo = endOfMonth(subMonths(formatDate(currentTo), 1));
  }

  if (basedOn === CurrentDate.week) {
    // In Saudi Arabia Saturday is the first day of the week, but this function assumes that Sunday is the first day of the week
    // so we need to get the end of the week to be Saturday
    // Same with the end of the week, Friday is the last day of the week, but this function assumes that Saturday is the last day of the week
    // so we need to get the end of the week to be Friday

    // From the first day of the current week to today
    currentFrom = subDays(startOfWeek(addDays(formatDate(new Date()), 1)), 1);
    currentTo = subDays(endOfWeek(addDays(formatDate(new Date()), 1)), 1);

    // From the first day of the previous week to the last day of the previous week
    previousFrom = subDays(
      startOfWeek(subWeeks(addDays(formatDate(new Date()), 1), 1)),
      1
    );
    previousTo = subDays(
      endOfWeek(subWeeks(addDays(formatDate(new Date()), 1), 1)),
      1
    );
  }

  if (basedOn === CurrentDate.day) {
    // 30-09 - 30-09
    currentFrom = startOfDay(formatDate(new Date()));
    currentTo = endOfDay(formatDate(new Date()));

    // 29-09 - 29-09
    previousFrom = startOfDay(subDays(formatDate(new Date()), 1));
    previousTo = endOfDay(subDays(formatDate(new Date()), 1));
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
/**
 *
 * @param {number} year
 * @default new Date().getFullYear()
 * @example getTotalViolationsBasedOnYear(2024) // Returns the total number of violations recorded in 2024
 * @returns {Promise<number>} The total number of violations recorded in the specified year
 */
export async function getTotalViolationsBasedOnYear(year: number) {
  const from = startOfYear(formatDate(new Date(year, 0, 1)));
  const to = endOfDay(formatDate(new Date(year, 11, 31)));

  const fromStr = format(from, "yyyy-MM-dd");
  const toStr = format(to, "yyyy-MM-dd");

  const data = db.violations.count({
    where: {
      date: {
        gte: fromStr,
        lte: toStr,
      },
    },
  });

  return data;
}

// This function will return the total number of violations recorded in the specified interval (hourly, daily, monthly, yearly)
/**
 *
 * @param {Date} from
 * @param {Date} to
 * @param {Interval} basedOn
 * @param {boolean} dateFromFrontend required to fix the date issue from the frontend (date is one day behind)
 * @returns {Promise<{result: any[], from: Date, to: Date, basedOn: Interval}>} The total number of violations recorded in the specified interval
 * @example getViolationsBasedOnInterval({ from: new Date("2024-09-01"), to: new Date("2024-09-30"), basedOn: Interval.daily, dateFromFrontend: true }) // Returns the total number of violations recorded in each day between 2024-09-01 and 2024-09-30
 * @example getViolationsBasedOnInterval({ basedOn: Interval.hourly, from: new Date("2024-09-01"), to: new Date("2024-09-30"), dateFromFrontend: true }) // Returns the total number of violations recorded in each hour between 2024-09-01 and 2024-09-30
 */
export async function getViolationsBasedOnInterval({
  from,
  to,
  basedOn,
  dateFromFrontend,
}: {
  from: Date;
  to: Date;
  basedOn: Interval;
  dateFromFrontend: boolean;
}) {
  // Date sent from the frontend are one day behind, so we need to add one day to the to date
  // But in the backend, the date is correct.
  if (dateFromFrontend && process.env.NODE_ENV !== "development") {
    from = addDays(new Date(from), 1);
    to = addDays(new Date(to), 1);
  }

  const fromStr = format(from, "yyyy-MM-dd");
  const toStr = format(to, "yyyy-MM-dd");

  const pipelineObj: any = {};

  // hourly
  if (basedOn === Interval.hourly) {
    pipelineObj.addFields = {
      hour: {
        $toInt: {
          $arrayElemAt: [{ $split: ["$time", ":"] }, 0],
        },
      },
    };
    pipelineObj.group = {
      _id: "$hour",
      count: { $sum: 1 },
    };
  }
  // daily
  if (basedOn === Interval.daily) {
    pipelineObj.addFields = {
      day: {
        $dateFromString: {
          dateString: "$date",
        },
      },
    };
    pipelineObj.group = {
      _id: {
        $dateToString: {
          format: "%d",
          date: "$day",
        },
      },
      count: { $sum: 1 },
    };
  }
  // monthly
  if (basedOn === Interval.monthly) {
    pipelineObj.addFields = {
      month: {
        $dateFromString: {
          dateString: "$date",
        },
      },
    };
    pipelineObj.group = {
      _id: {
        $dateToString: {
          format: "%m",
          date: "$month",
        },
      },
      count: { $sum: 1 },
    };
  }
  // yearly
  if (basedOn === Interval.yearly) {
    pipelineObj.addFields = {
      year: {
        $dateFromString: {
          dateString: "$date",
        },
      },
    };
    pipelineObj.group = {
      _id: {
        $dateToString: {
          format: "%Y",
          date: "$year",
        },
      },
      count: { $sum: 1 },
    };
  }

  const result = await db.violations.aggregateRaw({
    pipeline: [
      {
        $match: {
          date: {
            $gte: fromStr,
            $lte: toStr,
          },
        },
      },

      {
        $addFields: pipelineObj.addFields,
      },
      {
        $group: pipelineObj.group,
      },
      {
        $sort: { _id: 1 },
      },
    ],
  });

  return {
    result,
    from,
    to,
    basedOn,
  };
}

// Summary of violations for a specific date
/**
 *
 * @param {number} year Optional
 * @param {number} month Optional
 * @param {number} day Optional
 * @param {boolean} dateFromFrontend Optional
 * @param {CurrentDate} current Optional
 * @returns {Promise<{totalViolations: number, highestViolatedDay: {day: string, count: number}, violationsStats: {streetName: {maxCount: number, maxStreets: string[]}, vehicleType: {maxCount: number, maxVehicles: string[]}, violationType: {maxCount: number, maxViolations: string[]}} | null>} The total number of violations recorded in the specified date, the highest number of violations recorded in a day, and the stats of the violations in the specified date
 * @example getViolationsSummaryBasedOnDate({ year: 2024, month: 9, day: 30 }) // Returns the total number of violations recorded on 2024-09-30, the highest number of violations based on street, vehicle, violation type, and the day
 * @example getViolationsSummaryBasedOnDate({current: CurrentDate.day}) // Returns the total number of violations recorded on the current day, the highest number of violations based on street, vehicle, violation type, and the day
 */
export async function getViolationsSummaryBasedOnDate({
  year,
  month,
  day,
  dateFromFrontend,
  current,
}: {
  year?: number;
  month?: number;
  day?: number;
  dateFromFrontend?: boolean;
  current?: CurrentDate;
}) {
  try {
    if (!year && !month && !day && !current) {
      throw new Error("Please provide a year, month, or day");
    }

    if (year && year.toString().length !== 4) {
      throw new Error("Invalid year");
    }

    if (month && (month < 1 || month > 12)) {
      throw new Error("Invalid month");
    }

    if (day && (day < 1 || day > 31)) {
      throw new Error("Invalid day");
    }

    let from = startOfYear(formatDate(new Date()));
    let to = endOfDay(formatDate(new Date()));

    // Case 1: Only year is passed
    if (year) {
      from = startOfYear(formatDate(new Date(year, 0, 1)));
      to = endOfDay(formatDate(new Date(year, 11, 31)));
    }

    // Case 2: Only month is passed
    if (month && !year) {
      from = startOfMonth(
        formatDate(new Date(new Date().getFullYear(), month - 1, 1))
      );
      to = endOfMonth(
        formatDate(new Date(new Date().getFullYear(), month - 1, 1))
      );
    }

    // Case 3: Only day is passed
    if (day && !month && !year) {
      from = startOfDay(
        formatDate(
          new Date(new Date().getFullYear(), new Date().getMonth(), day)
        )
      );
      to = endOfDay(
        formatDate(
          new Date(new Date().getFullYear(), new Date().getMonth(), day)
        )
      );
    }

    // Case 4: Only year and month are passed (month of the current year)
    if (year && month) {
      from = startOfMonth(formatDate(new Date(year, month - 1, 1)));
      to = endOfMonth(formatDate(new Date(year, month - 1, 1)));
    }

    // Case 5: Only year and day are passed (day of the current month)
    if (year && day) {
      from = startOfDay(formatDate(new Date(year, new Date().getMonth(), day)));
      to = endOfDay(formatDate(new Date(year, new Date().getMonth(), day)));
    }

    // Case 6: Only month and day are passed (day of the current month)
    if (month && day && !year) {
      from = startOfDay(
        formatDate(new Date(new Date().getFullYear(), month - 1, day))
      );
      to = endOfDay(
        formatDate(new Date(new Date().getFullYear(), month - 1, day))
      );
    }

    // Case 7: Year, month, and day are passed
    if (year && month && day) {
      from = startOfDay(formatDate(new Date(year, month - 1, day)));
      to = endOfDay(formatDate(new Date(year, month - 1, day)));
    }

    if (current === CurrentDate.day) {
      from = startOfDay(formatDate(new Date()));
      to = endOfDay(formatDate(new Date()));
    }

    if (current === CurrentDate.week) {
      from = subDays(startOfWeek(addDays(formatDate(new Date()), 1)), 1);
      to = subDays(endOfWeek(addDays(formatDate(new Date()), 1)), 1);
    }

    if (current === CurrentDate.month) {
      from = startOfMonth(formatDate(new Date()));
      to = endOfDay(formatDate(new Date()));
    }

    if (current === CurrentDate.year) {
      from = startOfYear(formatDate(new Date()));
      to = endOfDay(formatDate(new Date()));
    }

    if (dateFromFrontend && process.env.NODE_ENV !== "development") {
      from = addDays(new Date(from), 1);
      to = addDays(new Date(to), 1);
    }

    const fromStr = format(from, "yyyy-MM-dd");
    const toStr = format(to, "yyyy-MM-dd");

    const totalViolations = await db.violations.count({
      where: {
        date: {
          gte: fromStr,
          lte: toStr,
        },
      },
    });

    // Early return if there are no violations
    if (totalViolations === 0) {
      return {
        totalViolations,
        highestViolatedDay: {
          day: "No data",
          count: 0,
        },
        violationsStats: {
          streetName: {
            maxCount: 0,
            maxStreets: [],
          },
          vehicleType: {
            maxCount: 0,
            maxVehicles: [],
          },
          violationType: {
            maxCount: 0,
            maxViolations: [],
          },
        },
      };
    }

    // Summary of the violations based on the year, month, week, and day
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

    // Day where the highest number of violations recorded
    const highestViolationsOnDay = db.violations.groupBy({
      by: ["date"],
      where: {
        date: {
          gte: fromStr,
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

    const [streetName, vehicleType, violationType, highestViolatedDay] =
      await db.$transaction([
        streetNameGroup,
        vehicleTypeGroup,
        violationTypeGroup,
        highestViolationsOnDay,
      ]);

    if (!highestViolatedDay.length) {
      highestViolatedDay.push({
        _max: { date: "No data" },
        _count: { date: 0 },
        date: "No data",
      });
    }

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
        ? violationType.filter(
            v => v._count.violation_type === violationMaxCount
          )
        : [];

    return {
      totalViolations,
      highestViolatedDay: {
        day: highestViolatedDay[0]._max.date,
        count: highestViolatedDay[0]._count.date,
      },
      violationsStats: {
        streetName: {
          maxCount: streetMaxCount,
          maxStreets: streetMaxViolation.map(
            v => v._max.street_name
          ) as string[],
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
      },
    };
  } catch (error: any) {
    throw new Error("Error fetching violations");
  }
}

// This function will return the violations based on the violation type
/**
 *
 * @param {string} violationType
 * @param {Date} from Optional
 * @param {Date} to Optional
 * @returns {Promise<any[]>} All the violations recorded with the specified violation type
 * @example getViolationsByViolationType({ violationType: "overtaking from right" }) // Returns all the violations recorded with the violation type "overtaking from right"
 */
export async function getViolationsByViolationType({
  violationType,
  from,
  to,
}: {
  violationType: "overtaking from right" | "overtaking from left";
  from?: Date;
  to?: Date;
}) {
  try {
    const fromStr = from ? format(from, "yyyy-MM-dd") : undefined;
    const toStr = to ? format(to, "yyyy-MM-dd") : undefined;

    const data = await db.violations.findMany({
      where: {
        violation_type: violationType,
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

// This function will return the violations based on the street name
/**
 *
 * @param {string} streetName
 * @param {Date} from Optional
 * @param {Date} to Optional
 * @returns {Promise<any[]>} All the violations recorded with the specified street name
 * @example getViolationsByStreetName({ streetName: "King Fahd Road" }) // Returns all the violations recorded with the street name "King Fahd Road"
 *  */
export async function getViolationsByStreetName({
  streetName,
  from,
  to,
}: {
  streetName: string;
  from?: Date;
  to?: Date;
}) {
  try {
    const fromStr = from ? format(from, "yyyy-MM-dd") : undefined;
    const toStr = to ? format(to, "yyyy-MM-dd") : undefined;

    const data = await db.violations.findMany({
      where: {
        street_name: {
          mode: "insensitive", // Ovveride the case sensitivity
          equals: streetName,
        },
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

// This function will return violations based on latitude and longitude
/**
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<any[]>} All the violations recorded within the specified radius
 * @example getViolationsByLocation({ latitude: 24.7136, longitude: 46.6753 }) // Returns all the violations from the specified latitude and longitude
 */

export async function getViolationsByLocation({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  try {
    const data = await db.violations.findMany({
      where: {
        latitude: latitude,
        longitude: longitude,
      },
    });

    return data;
  } catch (error: any) {
    throw new Error("Error fetching violations");
  }
}
