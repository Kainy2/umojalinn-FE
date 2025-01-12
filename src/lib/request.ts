import type { NextRequest } from "next/server";

export const handleQueryParams = (
  req: NextRequest,
  initiating: boolean | undefined
) => {
  const searchParams = req.nextUrl.toString();

  const addedParam = getAllSearchParameters(searchParams, initiating);

  return addedParam;
};

function getAllSearchParameters(url: string, initiating?: boolean): string {
  try {
    const urlObject = new URL(url);
    const searchParams = urlObject.searchParams;
    const entries = searchParams.entries();

    // Build the string representation of parameters
    let paramsString = `${initiating ? "?" : "&"}`;

    for (const [key, value] of Array.from(entries)) {
      paramsString += `${key}=${value}&`;
    }

    // Remove the trailing "&" character
    return paramsString.slice(0, -1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_: unknown) {
    // Handle invalid URL or other errors
    return "";
  }
}

export const convertApiParams = (params: Record<string, unknown>) => {
  return (
    "?" +
    Object.entries(params)
      .map(
        (entries) =>
          `${entries[0]}=${
            Array.isArray(entries[1]) ? entries[1]?.join(",") : entries[1]
          }`
      )
      .join("&")
  );
};
