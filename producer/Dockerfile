# Usa una imagen base de Node.js
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto para Express
EXPOSE 3001

# Comando de inicio
CMD ["node", "index.js"]
