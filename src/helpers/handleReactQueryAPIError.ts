import { toast } from "@/hooks/use-toast";
import handleClientError from "./handleClientError";

interface Props {
  error: Error;
  parentKey?: string;
}

export function isObject(value: any) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: any) {
  return typeof value === "string";
}

function toastWhenString(value: any) {
  if (isString(value)) {
    toast({ description: value, variant: "destructive" });
    return true;
  }

  return false;
}

export function handleWhenStringOrArrayOrObject({
  value,
  doToast = true,
}: {
  value: any;
  doToast?: boolean;
}): string | null {
  let errorMessage = null;

  if (doToast) {
    if (toastWhenString(value)) {
      return value;
    }
  } else {
    if (isString(value)) {
      return value;
    }
  }

  if (Array.isArray(value) && value.length > 0) {
    for (let i = 0; i < value.length; i++) {
      const element = value[i];
      errorMessage = handleWhenStringOrArrayOrObject({
        value: element,
        doToast,
      });
      if (errorMessage) {
        return errorMessage;
      }
    }
  }

  if (isObject(value)) {
    for (const key in value) {
      const property = value[key];
      errorMessage = handleWhenStringOrArrayOrObject({
        value: property,
        doToast,
      });
      if (errorMessage) {
        return errorMessage;
      }
    }
  }

  return errorMessage;
}

function handleAPIError({ error }: Props) {
  const errorResponseData = error.message;

  const toastMessage = handleWhenStringOrArrayOrObject({
    value: errorResponseData,
  });

  handleClientError({
    error: new Error(toastMessage ?? "Unknown error"),
    pathname: "react-query",
    searchParams: null,
  });
}

export default handleAPIError;
