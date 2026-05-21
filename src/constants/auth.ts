const isProd = process.env.NODE_ENV === "production";
const secret = process.env.NEXTAUTH_SECRET;

const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

if (isProd && !secret && !isBuildPhase) {
  throw new Error("Security Alert: NEXTAUTH_SECRET is not configured.");
}

if (isProd && secret === "edumetric-development-secret") {
  console.warn(
    "Security Warning: NEXTAUTH_SECRET is set to the default development secret. Make sure to change this in production."
  );
}

export const authSecret = secret ?? "edumetric-development-secret";

