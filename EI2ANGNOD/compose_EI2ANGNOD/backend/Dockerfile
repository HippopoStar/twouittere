FROM node:lts-buster-slim

RUN apt-get update \
	&& apt-get install -y vim

RUN npm install -g express cors body-parser fs mongodb

COPY ./SERVEURS_NODE /root/SERVEURS_NODE

WORKDIR /root/SERVEURS_NODE

RUN npm install

EXPOSE 8888

CMD ["node", "OnlineSalesServer.js", "&"]
#CMD ["node", "OnlineSalesHttpsServer.js", "&"]

