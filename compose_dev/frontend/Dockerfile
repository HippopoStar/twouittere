FROM debian:buster

RUN apt-get update \
	&& apt-get install -y curl git sudo

RUN { curl -fsSL https://deb.nodesource.com/setup_14.x \
	| bash - ;} \
	&& apt-get install -y nodejs

RUN npm install -g @angular/cli@latest

RUN sudo --user=root git config --global user.email "leocabanes@wanadoo.fr" \
	&& sudo --user=root git config --global user.name "HippopoStar"

RUN mkdir --parents /root/angular

WORKDIR /root/angular

RUN ng new --routing --strict --style css TWOUITTERE

RUN rm --recursive --force TWOUITTERE/src/app/*

WORKDIR /root/angular/TWOUITTERE

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

