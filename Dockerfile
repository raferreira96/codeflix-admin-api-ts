FROM node:22.13.0-slim

RUN npm install -g pnpm

USER node

WORKDIR /home/node/app

ENTRYPOINT ["tail", "-f", "/dev/null"]