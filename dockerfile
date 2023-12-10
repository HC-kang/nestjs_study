# ----------------------------------------
## Build for Local development
# ----------------------------------------
FROM node:20-alpine as build

WORKDIR /usr/src/app

# 레이어 캐시를 위한 종속성 파일 복사 및 설치
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# ----------------------------------------
## Run for production
# ----------------------------------------
FROM node:20-alpine as production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

ENV NODE_ENV=production

USER node

CMD ["node", "dist/main.js"]

EXPOSE 3000
