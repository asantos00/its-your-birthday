FROM node:12-buster

COPY package* ./
RUN npm install

COPY . .
RUN npm run generate-prisma
RUN npm run build

EXPOSE 3000

USER node
CMD [ "npm", "start" ]
