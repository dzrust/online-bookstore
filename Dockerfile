FROM node:15.8

WORKDIR /online-bookstore

COPY . .

RUN npm i
RUN npm run-script build-fe

CMD [ "npm", "start" ]