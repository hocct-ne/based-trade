import { nextConfig } from "@/config";
import { ReadonlyURLSearchParams } from "next/navigation";

export default function handleClientError({
  error,
  pathname,
  searchParams,
}: {
  error: Error;
  pathname: string;
  searchParams: ReadonlyURLSearchParams | null;
}) {
  fetch(`${nextConfig.nextRouteApi}/api/log-error`, {
    method: "POST",
    body: JSON.stringify({
      name: error?.name,
      cause: error?.cause,
      stack: error?.stack,
      message: error?.message,
      pathname: `${pathname}?${searchParams?.toString()}`,
    }),
  });
}
