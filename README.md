# twouittere

## Journal de bord

`docker pull debian:latest`  
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

