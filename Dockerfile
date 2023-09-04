FROM node:20-alpine AS development
WORKDIR /usr/app/api-pipeline
COPY package*.json ./
RUN npm install 
COPY . .
CMD ["npm run start"]
