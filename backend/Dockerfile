FROM node:16

WORKDIR /nestJS

COPY nestJS/tsconfig*.json ./
COPY nestJS/package*.json ./
RUN npm install

COPY ./ ./

EXPOSE 3000

CMD npm run start:dev
