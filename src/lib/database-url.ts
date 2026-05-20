export function withRequiredSslMode(connectionString: string) {
  const url = new URL(connectionString);

  if (!url.searchParams.has("sslmode")) {
    url.searchParams.set("sslmode", "require");
  }

  return url.toString();
}
