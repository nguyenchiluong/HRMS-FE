import springApi from "@/api/spring";
import { ViewCreditsRequest, ViewCreditsResponse } from "../types/transaction";

export async function fetchCredits(
  body: ViewCreditsRequest
): Promise<ViewCreditsResponse> {
  // Use shared axios instance so JWT is attached by interceptor
  const { data } = await springApi.post<ViewCreditsResponse>(
    "/api/credits/view",
    body
  );
  return data;
}
