import { NextResponse } from "next/server";
import { hyperServer } from "@/lib/hyperServer"; // <-- SDK instance server-side
import { handleRouteAPI } from "@/helpers/handleRouteAPI";

export async function GET(request: Request) {
  return handleRouteAPI({
    api: async () => {
      const mids = await hyperServer.info.getAllMids();
      return NextResponse.json(mids);
    },

    onError: (responseJson, response) => {
      return NextResponse.json(responseJson, { status: response.status });
    },

    log: "GET_ORDERBOOK",
  });
}
