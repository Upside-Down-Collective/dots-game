# Dots and Boxes

## Docker
In this project, Docker is used to easily set up hosting `Dots and Boxes` app.

### TLDR
Probably some of you may want to quickly set everything up, in this case, here is a short guide.  
Clone repository or copy and create file named `docker-compose.yml` containing this:
``` yml
version: '3.3'

services:
  dots-game:
    image: cimlah/dots-game:latest
    restart: unless-stopped
    hostname: dots-game1
    container_name: dots-game1
    command: bash -c 'web/Docker/app-start.sh'
    volumes:
      - ../../.:/usr/src/app
    
    ports:
      - "5001:5001"
    tty: true
    networks:
      dots-game_network:
        ipv4_address: 172.21.1.2


networks:
  dots-game_network:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: "172.21.1.0/24"
```

and execute command: `docker-compose up -d`.


### Dockerfile
Docker image is based on [Node version 16](https://hub.docker.com/_/node). It contains of instructions to copy all of project's files into work directory (except those excluded in .dockerignore). At the end, dependencies are installed using `npm install`.


### docker-compose.yml
Version 3.3 is used for the compose file. Most of the container's behaviour is set in `docker-compose.yml` intead of `Dockerfile` in favour of customasibility, although there are some things worth keeping in mind:
* Only host port, not container port should be changed. It could be for example: `- "4200:5001"` or `- "2137:5001"`, but not `- "5001:5004"`, because server in NodeJS runs on port 5001. **But it can be changed too, if you know how to.**
* If virtual network (or IP address assigned to container) created by `docker-compose.yml` is already present on your computer, then you can adjust subnet, for example istead of `- subnet: "172.21.1.0/24"` it could be `- subnet: "172.21.3.0/24"`.  
You can also make this container use *dynamic IP address*, just delete these lines:
``` yml
networks:
      dots-game_network:
        ipv4_address: 172.21.1.2
```

and

``` yml
networks:
  dots-game_network:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: "172.21.1.0/24"
```

* You can adjust commands, which are executed on container start in `app-start.sh` file or by completely changing `command: ` line.


### app-start.sh
This is a bash script, which is used for executing commands on container start.


### docker-build.sh
This is a bash script, which is used to build Docker image. Also, there is symlink located in root directory of the repository. Intended action to build image is to execute mentioned symlink.