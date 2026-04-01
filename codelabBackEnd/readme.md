Instalacion de dependencias:

npm install
npm install prisma --save-dev

Ejecucion de migraciones y creacion de cliente de prisma

npx prisma migrate dev --name init -> si es primera vez que se hace una migracion
npx prisma deploy -> si ya se han hecho migraciones
npx prisma generate -> para generar el cliente de prisma

Ejecucion del servidor

npm run start