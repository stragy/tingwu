FROM node:18-alpine

WORKDIR /app/packages/practice-service

COPY packages/practice-service/package*.json ./
RUN npm ci

COPY packages/practice-service/tsconfig.json ./
COPY packages/practice-service/src ./src

RUN npm run build

EXPOSE 3003

CMD ["node", "dist/index.js"]
