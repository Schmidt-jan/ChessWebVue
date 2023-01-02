FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g serve
COPY . .
RUN npm run build


EXPOSE 80
CMD ["serve", "dist/", "-p", "80"]