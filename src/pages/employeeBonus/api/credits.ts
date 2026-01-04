import { ViewCreditsRequest, ViewCreditsResponse } from "../types/transaction";

export async function fetchCredits(
  body: ViewCreditsRequest
): Promise<ViewCreditsResponse> {
  const res = await fetch("http://localhost:8080/api/credits/view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to fetch credits");
  return res.json();
}
