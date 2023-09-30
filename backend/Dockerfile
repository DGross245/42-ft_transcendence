FROM node:latest

WORKDIR /nestJS

COPY ./nestJS/tsconfig*.json ./
COPY ./nestJS/package*.json ./

RUN npm install

COPY ./nestJS/src ./src

EXPOSE 3000

CMD npm run start:dev
