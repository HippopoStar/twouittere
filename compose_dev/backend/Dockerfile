FROM node:lts-buster-slim

RUN npm install -g express cors body-parser fs mongodb nodemon

RUN mkdir --parents /root/TWOUITTERE

WORKDIR /root/TWOUITTERE

EXPOSE 3000

CMD ["npm", "run", "dev"]

