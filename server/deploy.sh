#!/bin/bash

echo What should the version be?
read VERSION

docker build -t fedellen/list-together:$VERSION .
docker push fedellen/list-together:$VERSION
ssh root@165.22.225.95 "docker pull fedellen/list-together:$VERSION && docker tag fedellen/list-together:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"