import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3001);
const host =
  process.env.HOST ?? (process.env.K_SERVICE ? '0.0.0.0' : '127.0.0.1');
const app = createApp();

app.listen(port, host, () => {
  console.log(`evalio-api listening on http://${host}:${port}`);
});
