FROM node:lts-buster

RUN apt-get update \
		&& apt-get install -y sudo git vim

RUN npm install -g @angular/cli@latest

RUN sudo --user=root git config --global user.email "leocabanes@wanadoo.fr" \
		&& sudo --user=root git config --global user.name "HippopoStar"

RUN mkdir --parents /root/angular

WORKDIR /root/angular

RUN ng new --routing --strict --style css OnlineSales

RUN rm --recursive --force /root/angular/OnlineSales/src/app

COPY ./ONLINESALES/src/app /root/angular/OnlineSales/src/app

WORKDIR /root/angular/OnlineSales

#RUN npm install

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

