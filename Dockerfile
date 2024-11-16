FROM node:18
WORKDIR /recipies-app
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8080
CMD ["node", "index.js"]