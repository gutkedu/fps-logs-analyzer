import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_NAME: z.string().default('fps_logs_analyzer'),
  DATABASE_USER: z.string().default('postgres'),
  DATABASE_PASSWORD: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('🥶 Invalid environment variables', z.treeifyError(_env.error));
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
