"use server";
import { format } from "date-fns";
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
    violation_type: "overtaking from the right",
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
    violation_type: "overtaking from the left",
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
    violation_type: "overtaking from the right",
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
    violation_type: "overtaking from the left",
    vehicle_type: "motorcycle",
    latitude: 24.7073,
    longitude: 46.6737,
    street_name: "Prince Sultan Road",
    zip_code: "12562",
  },
  {
    time: "22:05",
    date: new Date("2023-07-19T22:05:00"),
    license_plate_number: "55678",
    violation_type: "overtaking from the right",
    vehicle_type: "SUV",
    latitude: 24.6877,
    longitude: 46.7219,
    street_name: "Al Urubah Road",
    zip_code: "12343",
  },
];

export async function getAllViolation() {
  const data = await Violation.find().select("-__v");

  console.log(data);

  // await deleteAllEmbeddings();

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

  // formattedData.map(async doc => {
  //   await insertEmbedding(doc);
  // });

  return formattedData;
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
      console.log("Documents inserted:", docs);
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
