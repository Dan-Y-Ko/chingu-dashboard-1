export const currentDate =
  process.env.NODE_ENV === "development"
    ? new Date(2024, 9, 4, 15)
    : new Date();
