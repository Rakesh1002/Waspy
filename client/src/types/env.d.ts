declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
      API_KEY: string;
      [key: string]: string | undefined;
    }
  }
}

export {};
