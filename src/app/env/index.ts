import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('🥶 Invalid environment variables', z.treeifyError(_env.error));
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
