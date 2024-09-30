import {
  getAllViolation,
  getAllViolationsInRange,
  getViolationsStats,
} from "@/actions/violation";
import { CurrentDate } from "@/types/violation";
import { endOfDay, format, formatISO, startOfDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    // const from = req.headers.get("from");
    // const to = req.headers.get("to");

    // 1- Violation in range
    // if (from && to && !isNaN(Date.parse(from)) && !isNaN(Date.parse(to))) {
    //   const data = await getAllViolationsInRange({
    //     from: new Date(from),
    //     to: new Date(to),
    //   });
    //   return new NextResponse(JSON.stringify(data), { status: 200 });
    // }

    // 2- Violation stats based on Current Date
    const basedOn = request.nextUrl.searchParams.get("basedOn") as CurrentDate;
    // Access query params

    console.log("------------------basedOn------------------", basedOn);

    if (basedOn) {
      const data = await getViolationsStats({ current: basedOn });

      const end = endOfDay(new Date());

      console.log("It should be only include the current date");
      console.log(format(end, "yyyy-MM-dd"));

      return new NextResponse(
        JSON.stringify({
          data,
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
