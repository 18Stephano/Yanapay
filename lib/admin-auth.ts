export function isAdminAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return process.env.NODE_ENV === "development";
  }

  const header = request.headers.get("x-admin-secret");
  return header === secret;
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
