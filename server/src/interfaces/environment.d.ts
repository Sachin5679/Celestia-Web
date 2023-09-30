declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      FRONTEND_URL: string;
      PORT?: number;
      DB_URI: string;
      KEY: string;
      ADMIN_KEY: string;
    }
  }
}

export {};
