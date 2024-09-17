"use server";
import { format } from "date-fns";
import Detection from "@/models/detection";
import { detection } from "@/types/detection";

export async function getAllDetections() {
  const data = await Detection.find().select("-__v, -_id");

  const formattedData = data.map(detection => {
    return {
      date: detection.date,
      time: detection.time,
      license_plate_number: detection.license_plate_number,
      violation_type: detection.violation_type,
      vehicle_type: detection.vehicle_type,
      longitude: detection.longitude,
      latitude: detection.latitude,
      street_name: detection.street_name,
      zip_code: detection.zip_code,
      month: format(new Date(detection.date), "LLL"),
    } as detection;
  });

  return formattedData;
}

// The acutal insertion will be handled in other place (in python),
// and this function will be used to insert the data only for testing purposes
export async function createDetection() {
  const detections = [
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

  Detection.insertMany(detections)
    .then(docs => {
      console.log("Documents inserted:", docs);
    })
    .catch(err => {
      console.error("Error inserting documents:", err);
    });
}

// This is same as createDetection, it is used to delete all the data only for testing purposes
export async function deleteDetection() {
  const data = await Detection.deleteMany();

  console.log(data);

  return data;
}
