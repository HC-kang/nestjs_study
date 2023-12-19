# ----------------------------------------
## Build for Local development
# ----------------------------------------
FROM node:20-alpine as build

WORKDIR /usr/src/app

# 레이어 캐시를 위한 종속성 파일 복사 및 설치
COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

# ----------------------------------------
## Run for production
# ----------------------------------------
FROM node:20-alpine as production

ARG DATABASE_URL
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG SLACK_INC_WEBHOOK_URL

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

RUN mkdir logs

RUN echo "DATABASE_URL=$DATABASE_URL" >> .env
RUN echo "JWT_SECRET=$JWT_SECRET" >> .env
RUN echo "JWT_EXPIRES_IN=$JWT_EXPIRES_IN" >> .env
RUN echo "SLACK_INC_WEBHOOK_URL=$SLACK_INC_WEBHOOK_URL" >> .env

ENV NODE_ENV=production

USER node

CMD ["node", "dist/main.js"]

EXPOSE 3000
