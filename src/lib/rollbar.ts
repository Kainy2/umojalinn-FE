import Rollbar from "rollbar";

const baseConfig = {
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV,
};

export const clientConfig = {
  accessToken:
    process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN ||
    "75497d81ad574afeb80193257f261092",
  ...baseConfig,
};

export const serverInstance = new Rollbar({
  accessToken:
    process.env.ROLLBAR_SERVER_TOKEN || "038d583183d94a3785db5a0abcf71712",
  ...baseConfig,
});
