"use server";
import { format } from "date-fns";
import Violation from "@/models/violation";
import { violation } from "@/types/violation";

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
      zip_code: violation.zip_code,
      month: format(new Date(violation.date), "LLL"),
    } as violation;
  });

  return formattedData;
}

// The acutal insertion will be handled in other place (in python),
// and this function will be used to insert the data only for testing purposes
export async function createViolation() {
  const violation = [
    {
      time: "12:00",
      date: new Date(),
      license_plate_number: "1234",
      violation_type: "overtaking from the left",
      vehicle_type: "car",
      latitude: 24.77481,
      longitude: 46.820259,
      street_name: "Al Yarmook Street",
      zip_code: "1234",
    },
    {
      time: "14:30",
      date: new Date(),
      license_plate_number: "5678",
      violation_type: "overtaking from the right",
      vehicle_type: "truck",
      latitude: 24.656092,
      longitude: 46.879334,
      street_name: "Al Qadisiyah Street",
      zip_code: "5678",
    },
  ];

  Violation.insertMany(violation)
    .then(docs => {
      console.log("Documents inserted:", docs);
    })
    .catch(err => {
      console.error("Error inserting documents:", err);
    });
}

// This is same as createviolation, it is used to delete all the data only for testing purposes
export async function deleteviolation() {
  const data = await Violation.deleteMany();

  console.log(data);

  return data;
}
