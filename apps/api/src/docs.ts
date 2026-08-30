import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const spec = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'openapi.json'), {
    encoding: 'utf8',
  }),
) as object;

export function docsRouter(): Router {
  const router = Router();
  router.use(swaggerUi.serve);
  router.get(
    '/',
    swaggerUi.setup(spec, {
      customSiteTitle: 'Evalio API',
      swaggerOptions: { persistAuthorization: false },
    }),
  );
  return router;
}
