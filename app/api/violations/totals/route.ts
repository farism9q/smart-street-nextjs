import { db } from "@/lib/db";
import { Interval } from "@/types/violation";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest, response: NextResponse) {
  // Default value is "hourly"
  const basedOn = request.nextUrl.searchParams.get("basedOn") as Interval;

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

  const fromStr = format(from, "yyyy-MM-dd");
  const toStr = format(to, "yyyy-MM-dd");

  const pipelineObj: any = {};
  if (basedOn === Interval.hourly) {
    pipelineObj.addFields = {
      hour: {
        $toInt: {
          $arrayElemAt: [{ $split: ["$time", ":"] }, 0],
        },
      },
    };
    pipelineObj.group = {
      _id: "$hour",
      count: { $sum: 1 },
    };
  }
  if (basedOn === Interval.daily) {
    pipelineObj.addFields = {
      day: {
        $dateFromString: {
          dateString: "$date",
        },
      },
    };
    pipelineObj.group = {
      _id: {
        $dateToString: {
          format: "%d",
          date: "$day",
        },
      },
      count: { $sum: 1 },
    };
  }
  if (basedOn === Interval.monthly) {
    pipelineObj.addFields = {
      month: {
        $dateFromString: {
          dateString: "$date",
        },
      },
    };
    pipelineObj.group = {
      _id: {
        $dateToString: {
          format: "%m",
          date: "$month",
        },
      },
      count: { $sum: 1 },
    };
  }
  if (basedOn === Interval.yearly) {
    pipelineObj.addFields = {
      year: {
        $dateFromString: {
          dateString: "$date",
        },
      },
    };
    pipelineObj.group = {
      _id: {
        $dateToString: {
          format: "%Y",
          date: "$year",
        },
      },
      count: { $sum: 1 },
    };
  }

  const result = await db.violations.aggregateRaw({
    pipeline: [
      {
        $match: {
          date: {
            $gte: fromStr,
            $lte: toStr,
          },
        },
      },
      {
        $addFields: pipelineObj.addFields,
      },
      {
        $group: pipelineObj.group,
      },
      {
        $sort: { _id: 1 },
      },
    ],
  });

  console.log(result);

  return new NextResponse(JSON.stringify({ result, basedOn, from, to }), {
    status: 200,
  });
}
