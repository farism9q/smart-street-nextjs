import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// The idea of this seed is to create a set dummy data for violations in order to test the functions that will be used by:
// the chatbot and to display the data in the dashboard

// This can be run by running: "npm run db:seed"
const violations: Prisma.violationsCreateInput[] = [
  {
    date: "2024-10-04",
    time: "14:30",
    license_plate_number: "XYZ123",
    violation_type: "overtaking from left",
    vehicle_type: "car",
    longitude: 46.6823,
    latitude: 24.7139,
    street_name: "King Fahd Road",
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
