#!/bin/bash
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.5.0/bin

cd /home/ubuntu/sol-zap
git pull origin main
yarn install
yarn build
pm2 stop worker
pm2 start npm --name "worker" -- run "start:worker"