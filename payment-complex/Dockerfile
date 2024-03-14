FROM node:alpine

WORKDIR /directory

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4098

CMD ["node", "index.js"]
