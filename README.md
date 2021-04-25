# twouittere

## Journal de bord

`docker pull debian:buster`  
`docker pull node:lts-buster-slim`  
`docker pull mongo:latest`  

`mkdir docker_image_build_context`  
`cp ./dockerfiles/Dockerfile_twouittere_angular ./docker_image_build_context/Dockerfile`  
Dans le repertoire './docker\_image\_build\_context/' :  
|	`docker build --tag twouittere_angular:latest ./`  
`mkdir angular_front_end`  
`docker run --name twouittere_angular_container --tty --interactive --volume "$(pwd)/angular_front_end:/root/angular" --publish 4200:4200 --rm twouittere_angular:latest bash`  
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
|	`npm install express cors mongodb fs https md5sum --save`  
|	`npm install nodemon --save-dev`  

Dans un navigateur :
|	[nodemon](https://nodemon.io/)  
|	[GitHub - nodemon documentation](https://github.com/remy/nodemon#nodemon)  

