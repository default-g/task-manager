FROM node:19

WORKDIR /usr/src/app

COPY . .

RUN npm i 

EXPOSE 3000 8999 9000

CMD ["npm", "run", "start"]
