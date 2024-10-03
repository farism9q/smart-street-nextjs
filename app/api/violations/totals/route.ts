import {
  getTotalViolationsBasedOnYear,
  getViolationsBasedOnInterval,
} from "@/actions/violation";

import { Interval } from "@/types/violation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const year = request.nextUrl.searchParams.get("year");

    if (!year) {
      return new NextResponse("Invalid Request. Provide year", {
        status: 400,
      });
    }

    const data = await getTotalViolationsBasedOnYear(parseInt(year));

    return new NextResponse(JSON.stringify({ data }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Default value is "hourly"
    const basedOn = request.nextUrl.searchParams.get("basedOn") as Interval;

    if (!basedOn || !Object.values(Interval).includes(basedOn as Interval)) {
      return new NextResponse(
        "Invalid Request. Based on what ? [weekly, monthly]",
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const from = body.from as Date;
    const to = body.to as Date;

    if (!from || !to) {
      return new NextResponse(
        JSON.stringify({
          message:
            "There is no date range. Please provide them to get expected response",
        }),
        { status: 400 }
      );
    }

    const data = await getViolationsBasedOnInterval({
      basedOn,
      from,
      to,
    });

    return new NextResponse(
      JSON.stringify({
        data,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// EXAMPLE OF THE RESPONSE
/* {
  "result": [
    {
      _id: "01",
      count: 1
    }, 
    .....
  ],
  "basedOn": "hourly",
  "from": "2024-08-01",
  "to": "2024-09-31"
} */
