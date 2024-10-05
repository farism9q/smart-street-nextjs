import {
  getViolationsByLocation,
  getViolationsByStreetName,
  getViolationsByViolationType,
} from "@/actions/violation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const from = body.from;
    const to = body.to;

    // Violation Type
    const violationType = request.nextUrl.searchParams.get("violationType");

    // Street Name
    const streetName = request.nextUrl.searchParams.get("streetName");

    // Latitude and Longitude
    const lat = request.nextUrl.searchParams.get("lat");
    const long = request.nextUrl.searchParams.get("long");

    let data: any = undefined;

    // 1- Violation Type
    if (violationType) {
      if (
        violationType !== "overtaking from right" &&
        violationType !== "overtaking from left"
      ) {
        return new NextResponse(
          "We currently have only two types of violations: overtaking from left and right",
          { status: 400 }
        );
      }
      data = await getViolationsByViolationType({
        violationType: violationType as
          | "overtaking from right"
          | "overtaking from left",
        from,
        to,
      });

      return new NextResponse(
        JSON.stringify({
          data,
        }),
        { status: 200 }
      );
    }

    // 2- Street Name
    if (streetName) {
      data = await getViolationsByStreetName({
        streetName: streetName,
        from,
        to,
      });

      return new NextResponse(
        JSON.stringify({
          data,
        }),
        { status: 200 }
      );
    }

    // 3- Latitute and Longitude
    if (lat && long) {
      console.log(lat, long);

      data = await getViolationsByLocation({
        latitude: Number(lat),
        longitude: Number(long),
      });
    }

    if (data) {
      return new NextResponse(
        JSON.stringify({
          data,
        }),
        { status: 200 }
      );
    }

    return new NextResponse("Invalid Request", { status: 400 });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
