FROM node:19-alpine
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .