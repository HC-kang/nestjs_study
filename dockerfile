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
ARG AWS_LOG_REGION
ARG AWS_LOG_GROUP_NAME
ARG AWS_LOG_STREAM_NAME
ARG AWS_LOG_ACCESS_KEY_ID
ARG AWS_LOG_SECRET_ACCESS_KEY

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

RUN mkdir logs

RUN echo "DATABASE_URL=$DATABASE_URL" >> .env.production
RUN echo "JWT_SECRET=$JWT_SECRET" >> .env.production
RUN echo "JWT_EXPIRES_IN=$JWT_EXPIRES_IN" >> .env.production
RUN echo "SLACK_INC_WEBHOOK_URL=$SLACK_INC_WEBHOOK_URL" >> .env.production
RUN echo "AWS_LOG_REGION=$AWS_LOG_REGION" >> .env.production
RUN echo "AWS_LOG_GROUP_NAME=$AWS_LOG_GROUP_NAME" >> .env.production
RUN echo "AWS_LOG_STREAM_NAME=$AWS_LOG_STREAM_NAME" >> .env.production
RUN echo "AWS_LOG_ACCESS_KEY_ID=$AWS_LOG_ACCESS_KEY_ID" >> .env.production
RUN echo "AWS_LOG_SECRET_ACCESS_KEY=$AWS_LOG_SECRET_ACCESS_KEY" >> .env.production

ENV NODE_ENV=production

USER node

CMD ["node", "dist/main.js"]

EXPOSE 3000
