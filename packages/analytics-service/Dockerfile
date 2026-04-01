FROM node:18-alpine

WORKDIR /app/packages/analytics-service

COPY packages/analytics-service/package*.json ./
RUN npm ci

COPY packages/analytics-service/tsconfig.json ./
COPY packages/analytics-service/src ./src

RUN npm run build

EXPOSE 3006

CMD ["node", "dist/index.js"]
