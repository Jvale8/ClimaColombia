# Dockerfile for FrontEnd development
FROM node:20-alpine

WORKDIR /app

# Copiar los archivos de dependencias primero para aprovechar caché
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de la app
COPY . .

# Puerto que usa Vite en modo dev
EXPOSE 5173

# Arranca Vite para desarrollo y escucha en todas las interfaces
CMD ["npm", "run", "dev", "--", "--host"]
