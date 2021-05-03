FROM node:lts-buster-slim

#RUN npm install -g express cors body-parser fs mongodb async rxjs rxjs-compat

RUN mkdir --parents /root/TWOUITTERE

COPY ./app /root/TWOUITTERE/

WORKDIR /root/TWOUITTERE/app

EXPOSE 3000

CMD ["npm", "run", "start"]

