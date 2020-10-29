FROM node:12-alpine

RUN apk --no-cache add curl

WORKDIR /api-gateway

COPY . /api-gateway

RUN npm install

CMD npm start

EXPOSE 5000
