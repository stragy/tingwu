FROM node:18-alpine

WORKDIR /app/packages/user-service

COPY packages/user-service/package*.json ./
RUN npm ci

COPY packages/user-service/tsconfig.json ./
COPY packages/user-service/src ./src

RUN npm run build

EXPOSE 3002

CMD ["node", "dist/index.js"]
