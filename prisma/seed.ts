import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// The idea of this seed is to create a set dummy data for violations in order to test the functions that will be used by:
// the chatbot and to display the data in the dashboard

// This can be run by running: "npm run db:seed"
const violations: Prisma.violationsCreateInput[] = [
  {
    date: new Date("2024-09-14"),
    latitude: 24.123,
    longitude: 48.123,
    license_plate_number: "123",
    street_name: "oliya",
    vehicle_type: "car",
    time: "12:00",
    violation_type: "overtaking from right",
    zip_code: "123",
    v: 1,
  },
  {
    date: new Date("2024-09-15"),
    latitude: 24.456,
    longitude: 48.456,
    license_plate_number: "456",
    street_name: "king fahd",
    vehicle_type: "truck",
    time: "13:15",
    violation_type: "overtaking from left",
    zip_code: "456",
    v: 1,
  },
  {
    date: new Date("2024-09-16"),
    latitude: 24.789,
    longitude: 48.789,
    license_plate_number: "789",
    street_name: "thumamah",
    vehicle_type: "bus",
    time: "09:30",
    violation_type: "overtaking from right",
    zip_code: "789",
    v: 1,
  },
  {
    date: new Date("2024-09-17"),
    latitude: 24.321,
    longitude: 48.321,
    license_plate_number: "321",
    street_name: "tahlia",
    vehicle_type: "car",
    time: "17:45",
    violation_type: "overtaking from left",
    zip_code: "321",
    v: 1,
  },
  {
    date: new Date("2024-09-18"),
    latitude: 24.654,
    longitude: 48.654,
    license_plate_number: "654",
    street_name: "khurais",
    vehicle_type: "truck",
    time: "10:20",
    violation_type: "overtaking from right",
    zip_code: "654",
    v: 1,
  },

  // Next week
  {
    date: new Date("2024-09-21"),
    latitude: 24.987,
    longitude: 48.987,
    license_plate_number: "987",
    street_name: "oliya",
    vehicle_type: "bus",
    time: "08:30",
    violation_type: "overtaking from left",
    zip_code: "987",
    v: 1,
  },
  {
    date: new Date("2024-09-22"),
    latitude: 24.234,
    longitude: 48.234,
    license_plate_number: "234",
    street_name: "king abdullah",
    vehicle_type: "car",
    time: "11:45",
    violation_type: "overtaking from right",
    zip_code: "234",
    v: 1,
  },
  {
    date: new Date("2024-09-23"),
    latitude: 24.567,
    longitude: 48.567,
    license_plate_number: "567",
    street_name: "khurais",
    vehicle_type: "truck",
    time: "14:30",
    violation_type: "overtaking from left",
    zip_code: "567",
    v: 1,
  },
  {
    date: new Date("2024-09-24"),
    latitude: 24.89,
    longitude: 48.89,
    license_plate_number: "890",
    street_name: "oliya",
    vehicle_type: "car",
    time: "07:20",
    violation_type: "overtaking from right",
    zip_code: "890",
    v: 1,
  },
  {
    date: new Date("2024-09-25"),
    latitude: 24.112,
    longitude: 48.112,
    license_plate_number: "112",
    street_name: "tahlia",
    vehicle_type: "bus",
    time: "15:50",
    violation_type: "overtaking from left",
    zip_code: "112",
    v: 1,
  },
];
const main = async () => {
  try {
    console.log("Checking database connection...");
    await db.$connect();
    console.log("Connected to the database.");

    console.log("Seeding database...");
    await db.violations.createMany({
      data: violations,
    });
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await db.$disconnect();
  }
};

main();
