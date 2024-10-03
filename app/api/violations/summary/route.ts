import { getSummaryOfCurrentYear } from "@/actions/violation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getSummaryOfCurrentYear();

    return new NextResponse(JSON.stringify({ data }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
