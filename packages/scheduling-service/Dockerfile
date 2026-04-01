FROM node:18-alpine

WORKDIR /app/packages/scheduling-service

COPY packages/scheduling-service/package*.json ./
RUN npm ci

COPY packages/scheduling-service/tsconfig.json ./
COPY packages/scheduling-service/src ./src

RUN npm run build

EXPOSE 3005

CMD ["node", "dist/index.js"]
