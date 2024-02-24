FROM node:alpine
 
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Copy the rest of the app's source code
COPY . .
 
EXPOSE 4000

CMD [ "npm", "start" ]