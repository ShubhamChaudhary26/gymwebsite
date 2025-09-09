import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function requireAuth() {
  const token = cookies().get("token")?.value;
  if (!token) throw new Error("UNAUTHENTICATED");

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    uid: string;
    role: "USER" | "ADMIN";
  };

  return payload;
}

export function requireAdmin() {
  const user = requireAuth();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}
