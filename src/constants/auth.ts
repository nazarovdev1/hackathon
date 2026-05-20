const isProd = process.env.NODE_ENV === "production";
const secret = process.env.NEXTAUTH_SECRET;

if (isProd && (!secret || secret === "edumetric-development-secret")) {
  throw new Error(
    "Security Alert: NEXTAUTH_SECRET is not configured or is set to the default development secret in a production environment."
  );
}

export const authSecret = secret ?? "edumetric-development-secret";

