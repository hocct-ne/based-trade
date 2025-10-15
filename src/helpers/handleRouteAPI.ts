import { NextResponse } from "next/server";
import { logger } from "./logger";

interface HandleAPI {
  api: () => Promise<Response>;
  log: string;
  onSuccess?: (payload: any) => void;
  onError?: (payload: any, response: Response) => NextResponse<any>;
  isResponseBlob?: boolean;
}

export function handleRouteAPIError(
  error: any,
  response?: Response,
  overrideHttpResponseStatus?: number
) {
  return NextResponse.json(
    { error: error?.message },
    { status: overrideHttpResponseStatus || response?.status || 400 }
  );
}

export async function handleRouteAPI({
  api,
  log,
  isResponseBlob,
  onSuccess,
  onError,
}: HandleAPI) {
  logger.info(log);

  let response;
  let responseData;
  let overrideStatus;

  try {
    response = await api();
    overrideStatus = response.status;

    const responseContentType = response.headers.get("content-type")!;

    if (isResponseBlob) {
      responseData = await response.blob();
    } else if (response.status === 204) {
      // response no content
      responseData = null;
    } else if (responseContentType.indexOf("application/json") !== -1) {
      responseData = await response.json();
    } else {
      const responseText = await response.text();

      try {
        responseData = JSON.parse(responseText);
      } catch (error: any) {
        const edgyMode = response.headers.get("edgy-mode");
        const server = response.headers.get("server");

        if (
          edgyMode &&
          edgyMode?.toUpperCase() === "MAINTENANCE" &&
          server?.toUpperCase() === "CLOUDFLARE"
        ) {
          return NextResponse.json({
            message: "Oops! We hit a snag.",
            error: "TIMEOUT",
          });
        }

        overrideStatus = 400;
        throw new Error("Oops! We hit a snag.");
      }
    }

    if (!response.ok) {
      if (onError) {
        return onError(responseData, response);
      } else {
        const errorDetail = responseData.detail || response.statusText;
        logger.error(
          `API Error: ${errorDetail || "Sorry, something went wrong"}`
        );
        return NextResponse.json(
          { error: errorDetail?.message },
          { status: response.status || 400 }
        );
      }
    }

    onSuccess && onSuccess(responseData);

    if (isResponseBlob) {
      return new NextResponse(responseData);
    }

    if (responseData === null) {
      return new NextResponse(null, {
        status: 204,
      });
    }

    return NextResponse.json(responseData);
  } catch (error: any) {
    logger.error("handleRouteAPI catch error: " + error);
    return handleRouteAPIError(error, response, overrideStatus);
  }
}
