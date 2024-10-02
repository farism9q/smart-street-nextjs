import { getComparionOfTotalNbViolations } from "@/actions/violation";
import { CurrentDate } from "@/types/violation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const basedOn = request.nextUrl.searchParams.get("basedOn");

    // - Based on the current date
    if (
      !basedOn ||
      !Object.values(CurrentDate).includes(basedOn as CurrentDate)
    ) {
      return new NextResponse(
        "Invalid Request. Based on what ? [weekly, monthly]",
        {
          status: 400,
        }
      );
    }

    const data = await getComparionOfTotalNbViolations({
      basedOn: basedOn as CurrentDate,
    });
    return new NextResponse(JSON.stringify({ data }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
