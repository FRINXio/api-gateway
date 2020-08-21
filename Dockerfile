FROM node:12

WORKDIR /api-gateway

COPY . /api-gateway

RUN npm install

CMD npm start

EXPOSE 5000
