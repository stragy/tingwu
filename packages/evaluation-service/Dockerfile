FROM node:18-alpine

WORKDIR /app/packages/evaluation-service

COPY packages/evaluation-service/package*.json ./
RUN npm ci

COPY packages/evaluation-service/tsconfig.json ./
COPY packages/evaluation-service/src ./src

RUN npm run build

EXPOSE 3004

CMD ["node", "dist/index.js"]
