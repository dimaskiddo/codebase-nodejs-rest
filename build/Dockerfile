FROM dimaskiddo/alpine:nodejs-12
MAINTAINER Dimas Restu Hidayanto <dimas.restu@student.upi.edu>

WORKDIR /usr/src/app

COPY . .
RUN npm i -g npm \
    && npm i --production

EXPOSE 3000
HEALTHCHECK --interval=5s --timeout=3s CMD ["curl", "http://127.0.0.1:3000/health"] || exit 1

CMD ["npm","start"]
