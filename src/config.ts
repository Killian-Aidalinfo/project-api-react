export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface AppConfig {
  port: number;
  db: DbConfig;
}

export function loadConfig(env: Record<string, string | undefined> = process.env): AppConfig {
  return {
    port: Number(env.PORT ?? 3000),
    db: {
      host: env.DB_HOST ?? "localhost",
      port: Number(env.DB_PORT ?? 3306),
      user: env.DB_USER ?? "atelier",
      password: env.DB_PASSWORD ?? "atelierpwd",
      database: env.DB_NAME ?? "atelier",
    },
  };
}
