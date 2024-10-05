import {
  getAllViolation,
  getAllViolationsInRange,
  getViolationsSummaryBasedOnDate,
} from "@/actions/violation";
import { CurrentDate } from "@/types/violation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const basedOn = request.nextUrl.searchParams.get("basedOn");

    // 1- Based on the current date
    if (
      basedOn &&
      Object.values(CurrentDate).includes(basedOn as CurrentDate)
    ) {
      const data = await getViolationsSummaryBasedOnDate({
        current: basedOn as CurrentDate,
      });

      return new NextResponse(
        JSON.stringify({
          data,
          basedOn,
        }),
        { status: 200 }
      );
    }

    const data = await getAllViolation();

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const from = data.from;
    const to = data.to;

    if (!from || !to) {
      return new NextResponse("Invalid Request. Provide date range", {
        status: 400,
      });
    }

    const result = await getAllViolationsInRange({
      from,
      to,
      dateFromFrontend: false,
    });

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
