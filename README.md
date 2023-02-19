# UXAgent

## Prerequisites

- Docker must be installed on your machine.

## Instructions
Pull mongo image first

    docker pull mongo
    
Pull llleeemh/uxagent-backend. Visit the backend [docker repo](https://hub.docker.com/repository/docker/llleeemh/uxagent-backend).

    docker pull llleeemh/uxagent-backend
  
Pull llleeemh/uxagent-frontend. Visit the frontend [docker repo](https://hub.docker.com/repository/docker/llleeemh/uxagent-frontend).
  
    docker pull llleeemh/uxagent-frontend
    
Create a docker network

    docker network create my_network

Run MongoDB on that network

    docker run  --name my_mongodb --network my_network -d mongo
    
Insert collections to docker MongoDB database

    docker cp mongodb-data/uxagent/ my_mongodb:/data
    mongorestore --host my_mongodb --port 27017 --db uxagent /data/uxagent
    
Run uxagent backend
    
    docker run --name my_express --network my_network -p 3000:3000 -d llleeemh/uxagent-backend
    
Run uxagent frontend

    docker run -p 8080:80 --name my_frontend -d llleeemh/uxagent-frontend

