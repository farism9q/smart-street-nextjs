import { getViolationsSummaryBasedOnDate } from "@/actions/violation";
import { NextResponse } from "next/server";

// Summary of violations for a specific date
export async function POST(req: Request) {
  try {
    const { year, month, day } = await req.json();

    if (!year && !month && !day) {
      return new NextResponse("Please specify year, month, or day", {
        status: 400,
      });
    }

    if (year && year.toString().length !== 4) {
      return new NextResponse("Invalid year", { status: 400 });
    }

    if (month && (month < 1 || month > 12)) {
      return new NextResponse("Invalid month", { status: 400 });
    }

    if (day && (day < 1 || day > 31)) {
      return new NextResponse("Invalid day", { status: 400 });
    }

    if (
      (year && isNaN(year)) ||
      (month && isNaN(month)) ||
      (day && isNaN(day))
    ) {
      return new NextResponse("Invalid year, month, or day", { status: 400 });
    }

    const data = await getViolationsSummaryBasedOnDate({
      year,
      month,
      day,
    });

    return new NextResponse(JSON.stringify({ data }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
