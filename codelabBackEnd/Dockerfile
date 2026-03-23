FROM node:20-alpine

WORKDIR /app

# Dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Código fuente
COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && exec node src/app.js"]