"use server";

import Violation from "@/models/violation";
import { ViolationType } from "@/types/violation";
import { deleteAllEmbeddings, insertEmbedding } from "./pinecone";
import { getMonth } from "@/lib/utils";

// FAKE DATA
const violations = [
  {
    time: "08:45",
    date: new Date("2023-09-12T08:45:00"),
    license_plate_number: "12345",
    violation_type: "overtaking",
    vehicle_type: "car",
    latitude: 24.7136,
    longitude: 46.6753,
    street_name: "King Fahd Road",
    zip_code: "11564",
  },
  {
    time: "13:20",
    date: new Date("2023-08-25T13:20:00"),
    license_plate_number: "67890",
    violation_type: "overtaking",
    vehicle_type: "truck",
    latitude: 24.7254,
    longitude: 46.6561,
    street_name: "Olaya Street",
    zip_code: "12211",
  },
  {
    time: "09:50",
    date: new Date("2023-07-10T09:50:00"),
    license_plate_number: "11223",
    violation_type: "overtaking",
    vehicle_type: "bus",
    latitude: 24.7743,
    longitude: 46.7386,
    street_name: "Takhassusi Street",
    zip_code: "12345",
  },
  {
    time: "17:10",
    date: new Date("2023-09-03T17:10:00"),
    license_plate_number: "33445",
    violation_type: "overtaking",
    vehicle_type: "car",
    latitude: 24.7073,
    longitude: 46.6737,
    street_name: "Prince Sultan Road",
    zip_code: "12562",
  },
  {
    time: "22:05",
    date: new Date("2023-07-19T22:05:00"),
    license_plate_number: "55678",
    violation_type: "overtaking",
    vehicle_type: "bus",
    latitude: 24.6877,
    longitude: 46.7219,
    street_name: "Al Urubah Road",
    zip_code: "12343",
  },
  {
    time: "11:30",
    date: new Date("2023-08-30T11:30:00"),
    license_plate_number: "77899",
    violation_type: "overtaking",
    vehicle_type: "truck",
    latitude: 24.7136,
    longitude: 46.6753,
    street_name: "King Fahd Road",
    zip_code: "11564",
  },
  {
    time: "07:15",
    date: new Date("2023-09-01T07:15:00"),
    license_plate_number: "11223",
    violation_type: "overtaking",
    vehicle_type: "car",
    latitude: 24.7254,
    longitude: 46.6561,
    street_name: "Olaya Street",
    zip_code: "12211",
  },
  {
    time: "14:00",
    date: new Date("2023-07-27T14:00:00"),
    license_plate_number: "33445",
    violation_type: "overtaking",
    vehicle_type: "bus",
    latitude: 24.7743,
    longitude: 46.7386,
    street_name: "Takhassusi Street",
    zip_code: "12345",
  },
  {
    time: "19:30",
    date: new Date("2023-09-09T19:30:00"),
    license_plate_number: "55678",
    violation_type: "overtaking",
    vehicle_type: "truck",
    latitude: 24.7073,
    longitude: 46.6737,
    street_name: "Prince Sultan Road",
    zip_code: "12562",
  },
  {
    time: "10:00",
    date: new Date("2023-08-15T10:00:00"),
    license_plate_number: "77899",
    violation_type: "overtaking",
    vehicle_type: "car",
    latitude: 24.6877,
    longitude: 46.7219,
    street_name: "Al Urubah Road",
    zip_code: "12343",
  },
  // Create more fake data by with same values as above with same date and time
  {
    time: "08:45",
    date: new Date("2023-09-12T08:45:00"),
    license_plate_number: "12345",
    violation_type: "overtaking",
    vehicle_type: "car",
    latitude: 24.7136,
    longitude: 46.6753,
    street_name: "King Fahd Road",
    zip_code: "11564",
  },
  {
    time: "13:20",
    date: new Date("2023-08-25T13:20:00"),
    license_plate_number: "67890",
    violation_type: "overtaking",
    vehicle_type: "truck",
    latitude: 24.7254,
    longitude: 46.6561,
    street_name: "Olaya Street",
    zip_code: "12211",
  },
  {
    time: "09:50",
    date: new Date("2023-07-10T09:50:00"),
    license_plate_number: "11223",
    violation_type: "overtaking",
    vehicle_type: "bus",
    latitude: 24.7743,
    longitude: 46.7386,
    street_name: "Takhassusi Street",
    zip_code: "12345",
  },
  {
    time: "17:10",
    date: new Date("2023-09-03T17:10:00"),
    license_plate_number: "33445",
    violation_type: "overtaking",
    vehicle_type: "car",
    latitude: 24.7073,
    longitude: 46.6737,
    street_name: "Prince Sultan Road",
    zip_code: "12562",
  },
  {
    time: "22:05",
    date: new Date("2023-07-19T22:05:00"),
    license_plate_number: "55678",
    violation_type: "overtaking",
    vehicle_type: "bus",
    latitude: 24.6877,
    longitude: 46.7219,
    street_name: "Al Urubah Road",
    zip_code: "12343",
  },
  {
    time: "11:30",
    date: new Date("2023-08-30T11:30:00"),
    license_plate_number: "77899",
    violation_type: "overtaking",
    vehicle_type: "truck",
    latitude: 24.7136,
    longitude: 46.6753,
    street_name: "King Fahd Road",
    zip_code: "11564",
  },
];

export async function getAllViolation() {
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
}

export async function getViolationsStats() {
  const vehicleViolationTypes = await Violation.aggregate([
    {
      $group: {
        _id: ["$violation_type", "$vehicle_type", "$street_name"],
        total: { $sum: 1 },
        vehicle_type: { $first: "$vehicle_type" },
        violation_type: { $first: "$violation_type" },
        street_name: { $first: "$street_name" },
      },
    },
    {
      $project: {
        _id: 0, // To exclude the _id field
        vehicle_type: 1,
        violation_type: 1,
        street_name: 1,
        total: 1,
      },
    },
  ]);

  return vehicleViolationTypes;
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

// The acutal insertion will be handled in other place (in python),
// and this function will be used to insert the data only for testing purposes
export async function createViolation() {
  await Violation.deleteMany();
  await deleteAllEmbeddings();

  Violation.insertMany(violations)
    .then(docs => {
      docs.map(async doc => {
        await insertEmbedding(doc);
      });
    })
    .catch(err => {
      console.error("Error inserting documents:", err);
    });
}

// This is same as createviolation, it is used to delete all the data only for testing purposes
export async function deleteAllViolation() {
  const data = await Violation.deleteMany();

  console.log(data);

  return data;
}
