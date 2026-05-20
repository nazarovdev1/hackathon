const isProd = process.env.NODE_ENV === "production";
const secret = process.env.NEXTAUTH_SECRET;

if (isProd && !secret) {
  throw new Error("Security Alert: NEXTAUTH_SECRET is not configured.");
}

if (isProd && secret === "edumetric-development-secret") {
  console.warn(
    "Security Warning: NEXTAUTH_SECRET is set to the default development secret. Make sure to change this in production."
  );
}

export const authSecret = secret ?? "edumetric-development-secret";

