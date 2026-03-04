FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente y archivos de Prisma
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "src/app.js"]