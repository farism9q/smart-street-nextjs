import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// The idea of this seed is to create a set dummy data for violations in order to test the functions that will be used by:
// the chatbot and to display the data in the dashboard

// This can be run by running: "npm run db:seed"
const violations: Prisma.violationsCreateInput[] = [
  {
    date: "2024-09-12",
    latitude: 24.72515,
    longitude: 46.634721,
    license_plate_number: "011",
    street_name: "طريق الملك عبدالعزيز",
    vehicle_type: "car",
    time: "16:45",
    violation_type: "overtaking from right",
    zip_code: "54321",
    v: 5,
  },
  {
    date: "2024-09-18",
    latitude: 24.76268,
    longitude: 46.710619,
    license_plate_number: "012",
    street_name: "طريق عثمان بن عفان",
    vehicle_type: "car",
    time: "16:10",
    violation_type: "overtaking from left",
    zip_code: "54321",
    v: 5,
  },
  {
    date: "2024-09-22",
    latitude: 24.747431,
    longitude: 46.682034,
    license_plate_number: "013",
    street_name: "شارع التخصصي",
    vehicle_type: "car",
    time: "16:25",
    violation_type: "overtaking from right",
    zip_code: "54321",
    v: 5,
  },
  {
    date: "2024-09-15",
    latitude: 24.71692,
    longitude: 46.67026,
    license_plate_number: "014",
    street_name: "طريق العروبة",
    vehicle_type: "car",
    time: "15:50",
    violation_type: "overtaking from left",
    zip_code: "54321",
    v: 5,
  },
  {
    date: "2024-09-29",
    latitude: 24.745567,
    longitude: 46.657049,
    license_plate_number: "015",
    street_name: "شارع الامير مشعل بن عبدالعزيز",
    vehicle_type: "car",
    time: "15:30",
    violation_type: "overtaking from right",
    zip_code: "54321",
    v: 5,
  },
  {
    date: "2024-09-24",
    latitude: 24.743897,
    longitude: 46.646837,
    license_plate_number: "016",
    street_name: "شارع الملك سعود",
    vehicle_type: "car",
    time: "15:15",
    violation_type: "overtaking from left",
    zip_code: "54321",
    v: 5,
  },
  {
    date: "2024-09-17",
    latitude: 24.808706,
    longitude: 46.640396,
    license_plate_number: "017",
    street_name: "طريق الامام سعود بن فيصل",
    vehicle_type: "car",
    time: "17:05",
    violation_type: "overtaking from right",
    zip_code: "54321",
    v: 5,
  },
  {
    date: "2024-09-30",
    latitude: 24.713173,
    longitude: 46.65766,
    license_plate_number: "018",
    street_name: "طريق مكة المكرمة",
    vehicle_type: "car",
    time: "17:40",
    violation_type: "overtaking from left",
    zip_code: "54321",
    v: 5,
  },
  {
    date: "2024-10-02",
    latitude: 24.760678,
    longitude: 46.661223,
    license_plate_number: "019",
    street_name: "شارع صلاح الدين الأيوبي",
    vehicle_type: "car",
    time: "17:35",
    violation_type: "overtaking from right",
    zip_code: "54321",
    v: 5,
  },
  {
    date: "2024-09-28",
    latitude: 24.807322,
    longitude: 46.625578,
    license_plate_number: "020",
    street_name: "طريق انس بن مالك الفرعي",
    vehicle_type: "car",
    time: "17:55",
    violation_type: "overtaking from left",
    zip_code: "54321",
    v: 5,
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
