FROM node:18-alpine

WORKDIR /app/packages/auth-service

COPY packages/auth-service/package*.json ./
RUN npm ci

COPY packages/auth-service/tsconfig.json ./
COPY packages/auth-service/src ./src

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]
