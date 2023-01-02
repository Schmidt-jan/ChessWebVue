FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 80
CMD ["npx", "http-server", "dist/", "-p", "80"]