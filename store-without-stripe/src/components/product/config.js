const IS_PROD = process.env.NODE_ENV === "production";

const config = {
  BASE_URL: IS_PROD
    ? "https://api.lunchbowl.co.in"
    : "https://api.lunchbowl.co.in",
  SOCKET_URL: IS_PROD
    ? "https://api.lunchbowl.co.in"
    : "https://api.lunchbowl.co.in",
  // add other keys here as required
};

export default config;
