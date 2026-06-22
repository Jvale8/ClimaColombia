FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g ts-node-dev typescript
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]