import { NextRequest } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/security";

export function isAuthorizedAdmin(request: NextRequest) {
  return isAuthorizedAdminRequest(request);
}
