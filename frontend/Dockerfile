FROM node:16-alpine as dev

WORKDIR /frontend

COPY ./ ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
