FROM node:lts-buster-slim

RUN apt-get update \
	&& apt-get install -y vim

RUN npm install -g @angular/cli@latest

COPY ./ONLINESALES /root/ONLINESALES

WORKDIR /root/ONLINESALES

RUN npm install

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

