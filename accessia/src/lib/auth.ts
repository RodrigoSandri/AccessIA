
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function isAdmin(): Promise<boolean> {
  const authSecret = process.env.AUTH_SECRET;

  if (!authSecret) {
    return false;
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessia_session")?.value;

    if (!token) {
      return false;
    }

    const secret = new TextEncoder().encode(authSecret);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    return payload.sub === "admin" && payload.role === "admin";
  } catch {
    return false;
  }
}
