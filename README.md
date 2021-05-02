# twouittere

## Journal de bord

`docker pull debian:buster`  
`docker pull node:lts-buster-slim`  
`docker pull mongo:latest`  

Repertoires :  
`/var/lib/mongodb/` [Source](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/#run-mongodb-community-edition)  
`/data/db/` [Source (voir section Caveats)](https://hub.docker.com/_/mongo)  
`/usr/local/lib/node_modules/` [Source](https://docs.npmjs.com/cli/v7/configuring-npm/folders)  

POUR QUE LA CONNECTION FRONTEND/BACKEND PUISSE S'ETABLIR: se rendre a l'adresse du server back-end dans son navigateur et accepter manuellement le certificat auto-signe  
DROIT D'ACCES AUX FICHIERS: `sudo chown --recursive "$(id --user):$(id --group)" ./`  

`mkdir docker_image_build_context`  
`cp ./dockerfiles/Dockerfile_twouittere_angular ./docker_image_build_context/Dockerfile`  
Dans le repertoire './docker\_image\_build\_context/' :  
|	`docker build --tag twouittere_angular:latest ./`  
`mkdir angular_front_end`  
`docker run --name twouittere_angular_container --interactive --tty --volume "$(pwd)/angular_front_end:/root/angular" --publish 4200:4200 --rm twouittere_angular:latest bash`  
`docker run --name twouittere_angular_container --interactive --tty --volume "$(pwd)/compose_dev/frontend/app:/root/angular/TWOUITTERE/src/app" --publish 4200:4200 --rm compose_dev_frontend:latest bash`  
Dans le container :  
|	`git config --global user.email "leocabanes@wanadoo.fr"`  
|	`git config --global user.name "HippopoStar"`  
|	`ng new --routing TWOUITTERE`  
|	Dans le repertoire 'TWOUITTERE' :  
|	|	`ng serve --host 0.0.0.0 --port 4200`  
Dans un navigateur :  
|	[Serveur de developpement](http://127.0.0.1:4200/)  
`sudo chown --recursive "$(id --user):$(id --group)" ./angular_front_end/`  
`touch .gitignore`  
`git add angular_front_end/TWOUITTERE/` (le dernier '/' est necessaire)  

Dans un navigateur :
|	[Install MongoDB Community Edition on Debian - MongoDB Manual](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/)  
`cp ./dockerfiles/Dockerfile_twouittere_mongodb ./docker_image_build_context/Dockerfile`  
Dans le repertoire './docker\_image\_build\_context/' :  
|	`docker build --tag twouittere_mongodb:latest ./`  
`docker volume create twouittere_mongodb`  
`docker run --name twouittere_mongodb_container --tty --interactive --volume twouittere_mongodb:/var/lib/mongodb --publish 27017:27017 --rm twouittere_mongodb:latest bash`  

Dans un navigateur :  
|	[DockerHub - MongoDB](https://hub.docker.com/_/mongo)  
`docker pull mongo:latest`  
`docker run --name twouittere_mongod_container --detach --volume twouittere_mongodb:/var/lib/mongodb --publish 27017:27017 --rm mongo:latest`  

Dans un navigateur :  
|	[pip documentation - installation - upgrading pip](https://pip.pypa.io/en/stable/installing/#upgrading-pip)  
`python3 -m pip install -U pip`  
`pip3 install docker-compose`  

Dans un navigateur :  
|	[GitHub - Docker Compose](https://github.com/docker/compose)  
|	[Docker Documentation - Get started with Docker Compose](https://docs.docker.com/compose/gettingstarted/)  

`cp --recursive ./angular_front_end/TWOUITTERE/src/app ./compose_dev/frontend/app`  

Dans le repertoire 'compose\_dev' :  
|	docker-compose up -d  
|	docker-compose down  

`docker run --name twouittere_node_container --interactive --tty --volume "$(pwd)/compose_dev/backend/app:/root/TWOUITTERE" --publish 3000:3000 --rm node:lts-buster-slim bash`  
Dans le container :  
|	`npm init --yes`  
|	`npm install express cors mongodb fs async --save # rxjs rxjs-compact https body-parser md5sum crypto`  
|	`npm install nodemon --save-dev`  

Dans un navigateur :
|	[nodemon](https://nodemon.io/)  
|	[GitHub - nodemon documentation](https://github.com/remy/nodemon#nodemon)  

Dans le fichier './compose\_dev/backend/app/index.js' [Source](https://docs.mongodb.com/manual/reference/connection-string/) :  
|	`mongodb://admin:example@mongo:27017`  
Dans le fichier './compose\_dev/frontend/app/auth.service.ts' :  
|	`https://127.0.0.1:3000/auth/login`  

Dans un navigateur :
|	[NodeJS - Crypto - Hash](https://nodejs.org/api/all.html#crypto_crypto)  

Ne pas omettre de completer le champ "imports" des fichiers \<module\_name\>.module.ts

Dans un navigateur :  
|	[Mozilla Developer - JavaScript reference - Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)  
|	[GitHub.io - Mongo - find](http://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find)  
|	[docs.mongodb - order & limit](https://docs.mongodb.com/manual/reference/method/cursor.sort/#limit-results)  

Note: importer 'BrowserModule' abusivement peut s'averer contre-productif

Dans un navigateur :  
|	[Angular: Guide - http - reading the full response](https://angular.io/guide/http#reading-the-full-response)  
|	[Angular: Guide - http - handling request errors](https://angular.io/guide/http#handling-request-errors)  
|	[Angular: Reference - API reference - @angular/common/http - HttpClient - get](https://angular.io/api/common/http/HttpClient#get)  

|	[Angular: Guide - router](https://angular.io/guide/router)  
|	[Angular: Reference - API reference - @angular/router - Router - navigate](https://angular.io/api/router/Router#navigate)  
|	[Angular: Reference - API reference - @angular/router - ActivatedRoute - params](https://angular.io/api/router/ActivatedRoute#params)  

|	[Angular: Guide - component lifecycle - lifecycle hooks - DoCheck](https://angular.io/guide/lifecycle-hooks#defining-custom-change-detection)  
|	[Angular: Reference - API reference - @angular/core - DoCheck](https://angular.io/api/core/DoCheck)  

|	[Mozilla Developer - JavaScript reference - Array - concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)  
|	[Mozilla Developer - JavaScript reference - Array - push(/apply) - Merging two arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push#merging_two_arrays)  

|	[Jason Watmore's blog - Angular 2/5 - Communicating Between Components with Observable & Subject](https://jasonwatmore.com/post/2016/12/01/angular-2-communicating-between-components-with-observable-subject)  
|	[RxJS: Reference - API reference - Observable](https://rxjs.dev/api/index/class/Observable)  
|	[RxJS: Reference - API reference - Subject](https://rxjs.dev/api/index/class/Subject)  
|	[RxJS: Reference - API reference - Observer](https://rxjs.dev/api/index/interface/Observer)  
|	[RxJS: Reference - API reference - Subscription](https://rxjs.dev/api/index/class/Subscription)  
|	[RxJS: Reference - API reference - Subscriber](https://rxjs.dev/api/index/class/Subscriber)  
|	[NgRx - @ngrx/store](https://ngrx.io/)  

|	[Angular: Reference - API reference - @angular/common - AsyncPipe](https://angular.io/api/common/AsyncPipe)  

|	[RxJS: Overview - Subject - BehaviorSubject](https://rxjs.dev/guide/subject#behaviorsubject)  
|	[RxJS: Reference - API reference - BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject)  

