export const frontendUrl =
  process.env.NODE_ENV === "development" || !process.env.FRONTEND_URL
    ? "http://127.0.0.1:5173"
    : process.env.FRONTEND_URL;
