const configuredBaseUrl = process.env.REACT_APP_API_BASE_URL;

export const BASE_URL = (
  configuredBaseUrl || "https://divyaindiabackend.onrender.com/api/v1"
).replace(/\/$/, "");
