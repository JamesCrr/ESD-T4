FROM node:alpine

WORKDIR /directory

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3030

CMD ["node", "index.js"]
