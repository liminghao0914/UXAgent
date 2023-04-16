# UXAgent

## Prerequisites

- Docker must be installed on your machine.

## Installation 
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
    
Copy the dataset to `my_mongodb` container

    docker cp mongodb-data/uxagent/ my_mongodb:/data
    
Please get the `mongodb-data/uxagent/` in this repo by [link](https://github.com/liminghao0914/UXAgent/raw/master/mongodb-data.zip).

Before inserting the database, you need to get in the environment of `my_mongodb`.

    docker exec -it my_mongodb /bin/bash

Then, insert collections to `my_mongodb` database

    mongorestore --host my_mongodb --port 27017 --drop --db uxagent /data/uxagent
    
Run uxagent backend
    
    docker run --name my_express --network my_network -p 3000:3000 -d llleeemh/uxagent-backend
    
Run uxagent frontend

    docker run -p 8080:80 --name my_frontend -d llleeemh/uxagent-frontend
    
Finally, please visit `http://localhost:8080/`

## Tips
### For wizard
After opening the website in your browser, please use login by

    username: admin
    password: 123
    
To create participant's account (better create it in advance), please include condition (i.e. c1, c2 and c3) in the username. For instance,

    username: [username]@[condition]
    
Before the session, wizard has to select a participant by chat list (on the left side). Otherwise, you will not receive any message from the participant.

### For participant
- Just use it normally. The video player may not be at your expectations, since we only keep the basic functions to control the variables for modeling the impact of conversation.

