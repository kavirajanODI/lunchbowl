const IS_PROD = import.meta.env.MODE === "production";

const config = {
  BASE_URL: IS_PROD
    ? "https://api.dashboard.lunchbowl.co.in"
    : "http://localhost:5055",
  SOCKET_URL: IS_PROD
    ? "https://api.dashboard.lunchbowl.co.in"
    : "http://localhost:5055",
  // add other keys as required
};

export default config;

