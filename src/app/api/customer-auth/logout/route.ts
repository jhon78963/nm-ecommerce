import { logoutCustomerAction } from "@/features/customer-auth/actions/customer-auth.actions";
import { NextResponse } from "next/server";

export async function POST() {
  await logoutCustomerAction();
  return NextResponse.json({ success: true });
}
