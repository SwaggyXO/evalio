FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --filter @evalio/api...
WORKDIR /app/apps/api
ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080
CMD ["pnpm", "exec", "tsx", "src/index.ts"]
