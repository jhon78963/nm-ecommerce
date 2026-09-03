import { getCurrentCustomerAction } from "@/features/customer-auth/actions/customer-auth.actions";
import { NextResponse } from "next/server";

export async function GET() {
  const customer = await getCurrentCustomerAction();
  return NextResponse.json(customer);
}
