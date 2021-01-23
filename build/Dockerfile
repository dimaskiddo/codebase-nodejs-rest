FROM dimaskiddo/alpine:nodejs-12
MAINTAINER Dimas Restu Hidayanto <dimas.restu@student.upi.edu>

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i -g npm \
    && npm i --production

COPY . .

EXPOSE 3000
HEALTHCHECK --interval=5s --timeout=3s CMD ["sh", "-c", "curl http://127.0.0.1:3000/health"] || exit 1

CMD ["npm","start"]
