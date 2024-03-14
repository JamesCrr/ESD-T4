FROM node:alpine

WORKDIR /directory

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4099

CMD ["node", "index.js"]
