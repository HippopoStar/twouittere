FROM node:lts-buster-slim

RUN npm install -g express cors https body-parser mongodb fs md5sum nodemon

RUN mkdir --parents /root/TWOUITTERE

WORKDIR /root/TWOUITTERE

EXPOSE 3000

CMD ["npm", "run", "dev"]

