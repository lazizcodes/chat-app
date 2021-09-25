FROM node:14.17-alpine

RUN apk update

WORKDIR /app

COPY package.json .

RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD [ "node", "./server/server.js" ]