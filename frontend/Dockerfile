# Infinure Frontend Dockerfile - Development Mode
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT 3000
EXPOSE 3000
CMD ["npm", "run", "dev"] 