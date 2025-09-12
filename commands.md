# Run the docker image: 
    docker build -t planning-poker .

## Check if it's running
    docker ps

## View logs
    docker logs -f planning-poker-app

## Stop container
    docker stop planning-poker-app

## Remove container
    docker rm planning-poker-app

## Clean up
    docker system prune -f

## Run if already built
    docker run -d --name planning-poker-app -p 4000:4000 --restart unless-stopped planning-poker



# To run on other machine: 
    docker load -i planning-poker.tar

    docker run -d --name planning-poker-app -p 4000:4000 --restart unless-stopped planning-poker
