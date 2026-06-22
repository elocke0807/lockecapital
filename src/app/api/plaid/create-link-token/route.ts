import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CountryCode, Products } from "plaid";
import { plaidClient } from "@/lib/plaid";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: "Locke Capital AI",
      products: [Products.Transactions, Products.Investments],
      country_codes: [CountryCode.Us],
      language: "en",
    });
    return NextResponse.json({ link_token: response.data.link_token });
  } catch (err) {
    const plaidError = (err as { response?: { data?: unknown } })?.response?.data;
    console.error("Plaid create-link-token error", JSON.stringify(plaidError ?? err));
    return NextResponse.json({ error: "Failed to create link token" }, { status: 500 });
  }
}
