FROM node:12-buster

COPY package* ./
RUN npm install

COPY . .
RUN npm run build
RUN npm run generate-prisma

EXPOSE 3000

USER node
CMD [ "npm", "start" ]
