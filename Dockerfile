FROM node:15.8

WORKDIR /online-bookstore

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY . .

RUN npm run-script build-fe

CMD [ "npm", "start" ]