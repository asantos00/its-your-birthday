FROM node:12-buster

ADD . .

RUN npm install
RUN npm run build
RUN npm run generate-prisma

EXPOSE 3000

CMD [ "npm", "start" ]
