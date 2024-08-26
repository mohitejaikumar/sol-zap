#!/bin/bash
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.5.1/bin

cd /home/ubuntu/sol-zap
git pull origin main
yarn install
yarn build
pm2 stop hookBackend
pm2 start npm --name "hookBackend" -- run "start:hookbackend"