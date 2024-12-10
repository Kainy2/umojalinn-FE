declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NODE_ENV: "development" | "production" | "test";
    BACKEND_URL: string;
    SERVER_SECRET: string;
    NEXT_PUBLIC_BACKEND_URL: string;
    NEXT_PUBLIC_API_URL: string;
  }
}
