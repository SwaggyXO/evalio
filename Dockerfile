FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install
ENV VITE_API_URL=/api
RUN pnpm --filter @evalio/web build
WORKDIR /app/apps/api
ENV HOST=0.0.0.0
ENV PORT=8080
ENV WEB_DIST=/app/apps/web/dist
EXPOSE 8080
CMD ["pnpm", "exec", "tsx", "src/index.ts"]
