# Infinure Backend Dockerfile - Development Mode
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++ && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar nodemon globalmente para desarrollo
RUN npm install -g nodemon ts-node

# Copiar el código fuente
COPY . .

# Compilar el proyecto
RUN npm run build

EXPOSE 3000

# Comando para desarrollo con watch mode
CMD ["npm", "run", "start:dev"] 