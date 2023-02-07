FROM node:19-slim
WORKDIR /app
COPY package.json .
RUN npm install --quiet
RUN npm install -g nodemon


RUN npm ci \
 && npm cache clean --force \
 && mv /app/node_modules /node_modules

COPY . .