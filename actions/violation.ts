"use server";

import Violation from "@/models/violation";
import { CurrentDate, ViolationStats, ViolationType } from "@/types/violation";
import { getMonth } from "@/lib/utils";
import { startOfDay, startOfMonth, startOfYear } from "date-fns";

export async function getAllViolation() {
  try {
    const data = await Violation.find().select("-__v");

    const formattedData = data.map(violation => {
      return {
        _id: violation._id.toString(),
        date: violation.date,
        time: violation.time,
        license_plate_number: violation.license_plate_number,
        violation_type: violation.violation_type,
        vehicle_type: violation.vehicle_type,
        longitude: violation.longitude,
        latitude: violation.latitude,
        street_name: violation.street_name,
        month: getMonth(new Date(violation.date)),
      } as ViolationType;
    });

    return formattedData;
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
    const data = await Violation.aggregate([
      {
        $addFields: {
          dateConverted: { $toDate: "$date" }, // Convert the stored date to Date type
        },
      },
      {
        $match: {
          dateConverted: {
            $gte: from,
            $lte: to,
          },
        },
      },

      {
        $project: {
          _id: 1,
          date: "$dateConverted",
          time: 1,
          license_plate_number: 1,
          violation_type: 1,
          vehicle_type: 1,
          longitude: 1,
          latitude: 1,
          street_name: 1,
        },
      },
    ]).exec();

    const formattedData = data.map(violation => {
      return {
        _id: violation._id.toString(),
        date: violation.date,
        time: violation.time,
        license_plate_number: violation.license_plate_number,
        violation_type: violation.violation_type,
        vehicle_type: violation.vehicle_type,
        longitude: violation.longitude,
        latitude: violation.latitude,
        street_name: violation.street_name,
        month: getMonth(new Date(violation.date)),
      } as ViolationType;
    });

    return formattedData;
  } catch (error: any) {
    throw new Error("Error fetching violations");
  }
}

// This function will return the maximum number of steets, vehicles and violations that have the highest number of violations
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

  // Might be implemented later
  // if (current === CurrentDate.week) {
  //   from = startOfWeek(to);
  // }

  if (current === CurrentDate.day) {
    from = startOfDay(to);
  }

  const violationsStats = await Violation.aggregate([
    {
      $addFields: {
        dateConverted: { $toDate: "$date" },
      },
    },
    {
      $match: {
        dateConverted: {
          $gte: from,
          $lte: to,
        },
      },
    },
    {
      $facet: {
        streetNameGroup: [
          {
            $group: {
              _id: "$street_name",
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
          {
            $group: {
              _id: null,
              maxCount: { $first: "$count" },
              streets: {
                $push: {
                  name: "$_id",
                  count: "$count",
                },
              },
            },
          },
          {
            $project: {
              maxCount: 1,
              streets: {
                $filter: {
                  input: "$streets",
                  as: "street",
                  cond: { $eq: ["$$street.count", "$maxCount"] },
                },
              },
            },
          },
        ],
        vehicleTypeGroup: [
          {
            $group: {
              _id: "$vehicle_type",
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
          {
            $group: {
              _id: null,
              maxCount: { $first: "$count" },
              vehicles: {
                $push: {
                  name: "$_id",
                  count: "$count",
                },
              },
            },
          },
          {
            $project: {
              maxCount: 1,
              vehicles: {
                $filter: {
                  input: "$vehicles",
                  as: "vehicle",
                  cond: { $eq: ["$$vehicle.count", "$maxCount"] },
                },
              },
            },
          },
        ],
        violationTypeGroup: [
          {
            $group: {
              _id: "$violation_type",
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
          {
            $group: {
              _id: null,
              maxCount: { $first: "$count" },
              violations: {
                $push: {
                  name: "$_id",
                  count: "$count",
                },
              },
            },
          },
          {
            $project: {
              maxCount: 1,
              violations: {
                $filter: {
                  input: "$violations",
                  as: "violation",
                  cond: { $eq: ["$$violation.count", "$maxCount"] },
                },
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        streetName: {
          maxCount: { $arrayElemAt: ["$streetNameGroup.maxCount", 0] },
          maxStreets: { $arrayElemAt: ["$streetNameGroup.streets.name", 0] },
        },
        vehicleType: {
          maxCount: { $arrayElemAt: ["$vehicleTypeGroup.maxCount", 0] },
          maxVehicles: { $arrayElemAt: ["$vehicleTypeGroup.vehicles.name", 0] },
        },
        violationType: {
          maxCount: { $arrayElemAt: ["$violationTypeGroup.maxCount", 0] },
          maxViolations: {
            $arrayElemAt: ["$violationTypeGroup.violations.name", 0],
          },
        },
      },
    },
  ]);

  if (!violationsStats) {
    return [];
  }

  return violationsStats[0] as ViolationStats;
}

export async function getViolationByDate({
  year = true,
  month = false,
  day = false,
}: {
  year?: boolean;
  month?: boolean;
  day?: boolean;
}) {
  const obj: any = {};

  year && (obj.year = "$year");
  month && (obj.month = "$month");
  day && (obj.day = "$day");

  const group: any = {};

  year && (group.year = { $first: "$year" });
  month && (group.month = { $first: "$month" });
  day && (group.day = { $first: "$day" });

  const violationsDate = await Violation.aggregate([
    {
      $project: {
        date: {
          $toDate: "$date",
        },
        year: { $year: { $toDate: "$date" } },
        month: { $month: { $toDate: "$date" } },
        day: { $dayOfMonth: { $toDate: "$date" } },
      },
    },
    {
      $group: {
        _id: obj,
        total: { $sum: 1 },
        ...group,
      },
    },
    {
      $project: {
        _id: 0, // Exclude the _id field
        year: obj.year === false ? 0 : 1,
        month: obj.month === false ? 0 : 1,
        day: obj.day === false ? 0 : 1,
        total: 1,
      },
    },
  ]);

  return violationsDate;
}

// This function is used to compare the total number of violations based on the year, month and day
// If nothing is passed or the year only passed, it will compare the current year and previous year
// If month is passed, it will compare the current month and previous month
// If day is passed, it will compare the current day and previous day
export async function getComparionOfTotalNbViolations({
  current,
}: {
  current: CurrentDate;
}) {
  let objProject: any;

  if (current === CurrentDate.year) {
    objProject = {
      year: { $year: { $toDate: "$date" } },
    };
  }

  if (current === CurrentDate.month) {
    objProject = {
      month: { $month: { $toDate: "$date" } },
    };
  }

  // Might be implemented later
  // if (current === CurrentDate.week) {
  //   objProject = {
  //     week: { $week: { $toDate: "$date" } },
  //   };
  // }

  if (current === CurrentDate.day) {
    objProject = {
      day: { $dayOfMonth: { $toDate: "$date" } },
    };
  }

  let objMatch: any = {};
  const objGroup: any = {};
  // Case1: Compare the current year and previous year
  if (current === CurrentDate.year) {
    objMatch.year = {
      $gte: new Date().getFullYear() - 1,
      $lte: new Date().getFullYear(),
    };
    objGroup.year = { $first: "$year" };
  }

  // Case2: Compare the current month and previous month
  if (current === CurrentDate.month) {
    objMatch.month = {
      $gte: new Date().getMonth(),
      $lte: new Date().getMonth() + 1,
    };
    objMatch.year = new Date().getFullYear();
    objGroup.month = { $first: "$month" };
  }

  // Might be implemented later
  // if (current === CurrentDate.week) {
  //   objMatch.week = {
  //     $gte: startOfDay(new Date()).getDate() - 7,
  //     $lte: startOfDay(new Date()).getDate(),
  //   };
  //   objMatch.year = new Date().getFullYear();
  //   objMatch.month = new Date().getMonth() + 1;
  //   objGroup.week = { $first: "$week" };
  // }

  // Case3: Compare the current day and previous day
  if (current === CurrentDate.day) {
    objMatch.day = {
      $gte: new Date().getDate(),
      $lte: new Date().getDate() + 1,
    };
    objMatch.year = new Date().getFullYear();
    objMatch.month = new Date().getMonth() + 1;
    objGroup.day = { $first: "$day" };
  }

  const result = await Violation.aggregate([
    {
      $project: {
        ...objProject,
      },
    },
    {
      $match: {
        ...objMatch,
      },
    },
    {
      $group: {
        _id: { year: "$year", month: "$month", week: "$week", day: "$day" },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        year: 1,
        month: 1,
        day: 1,
        total: 1,
      },
    },
  ]);

  // If there is only one result, it means there is no comparison between current and previous: year, month or day
  if (result.length < 2) {
    return [];
  }

  // Not sure if it is (always) the first element is the current and the second is the previous
  const resultToBeReturned: any = {
    compare: current,
  };

  resultToBeReturned.current =
    result[0]._id[resultToBeReturned.compare] >
    result[1]._id[resultToBeReturned.compare]
      ? result[0]
      : result[1];

  resultToBeReturned.previous =
    result[0]._id[resultToBeReturned.compare] <
    result[1]._id[resultToBeReturned.compare]
      ? result[0]
      : result[1];

  return resultToBeReturned;
}

// *** This function is used to insert the data only for testing purposes ***
// The acutal insertion will be handled in other place (in python),
// and this function will be used to insert the data only for testing purposes
// export async function createViolation() {
//   // await Violation.deleteMany();
//   // await deleteAllEmbeddings();

//   // Violation.insertMany(violations)
//   //   .then(docs => {
//   //     docs.map(async doc => {
//   //       await insertEmbedding(doc);
//   //     });
//   //   })
//   //   .catch(err => {
//   //     console.error("Error inserting documents:", err);
//   //   });
// }

// This is same as createviolation, it is used to delete all the data only for testing purposes
// export async function deleteAllViolation() {
//   const data = await Violation.deleteMany();

//   console.log(data);

//   return data;
// }
