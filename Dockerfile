FROM node:22.13.0-slim

RUN apt-get update && apt-get install git -y && npm install -g pnpm

USER node

WORKDIR /home/node/app

ENTRYPOINT ["tail", "-f", "/dev/null"]