FROM node:20.12.2-alpine3.19 AS base

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build
EXPOSE 3000

# 빌드된 파일의 위치 확인
RUN ls -la dist/

# start:prod 스크립트 대신 직접 node 명령어 사용
CMD ["node", "dist/src/main.js"]