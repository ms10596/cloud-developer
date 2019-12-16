# Refactor Udagram app into Microservices and Deploy

Udagram is a simple image sharing service. In this branch we're separating the 3 main project components (User backend, Feed backend and frontend). Each component has a separate docker image. 

## Prerequisite
1. Docker version 19.03.2
2. docker-compose version 1.21.0

## Installation
1. ```$ git clone https://github.com/ms10596/cloud-developer.git```
2. ```$ cd cloud-developer```
3. ```$ git checkout staging```
4. ```$ docker-compose -f udacity-c3-deployment/docker/docker-compose-build.yaml build --parallel```
