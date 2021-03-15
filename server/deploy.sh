#!/bin/bash

echo What should the version be?
read VERSION

echo What is the server ip address?
read SERVERIP

docker build -t fedellen/list-together:$VERSION .
docker push fedellen/list-together:$VERSION
ssh root@$SERVERIP "docker pull fedellen/list-together:$VERSION && docker tag fedellen/list-together:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"