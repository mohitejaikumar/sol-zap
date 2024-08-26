#!/bin/bash
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.5.1/bin

cd /home/ubuntu/sol-zap
git pull origin main
yarn install
yarn build
pm2 stop primaryBackend
pm2 start npm --name "primaryBackend" -- run "start:backend"