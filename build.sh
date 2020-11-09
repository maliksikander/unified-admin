#!/usr/bin/env bash -x

echo 'Build Started at' $(date +'%Y-%m-%d %H:%M:%S.%N')
# build frontend distribution
echo 'Building frontend'
cd frontend
npm i
ng build --prod
cp -rf dist/base-template/* ../backend/src/public/
cd ../backend

# build docker image
# get branch tag
branch_name="$(git symbolic-ref HEAD 2>/dev/null)" ||
branch_name="(unnamed branch)"     # detached HEAD
finalBranchName=${branch_name##refs/heads/}

if [[ "$finalBranchName" == "master" ]]; then
  finalBranchName=${finalBranchName:-latest}
fi

image_tag="gitlab.expertflow.com:9242/cim/unified-admin:"${finalBranchName}

echo "Going to build image: $image_tag"

# build docker image
docker build -t $image_tag .






