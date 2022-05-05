import { verify } from "jsonwebtoken";

const APP_SECRET: string = process.env.APPSECRET as string;

export interface AuthTokenPayload {
  userId: number;
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    throw new Error("No token found");
  }

  return verify(token, APP_SECRET) as AuthTokenPayload;
}
