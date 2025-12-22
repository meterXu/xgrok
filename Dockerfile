FROM hub.xdog.icu/node:22-alpine

RUN apk update && apk add --no-cache \
    git ca-certificates wget tar bash openssl

WORKDIR /workspace

RUN git clone https://github.com/meterXu/xgrok.git

RUN cd xgrok\xgrok-client  && \
    npm  install && \
    npm run build:brower

RUN cd xgrok\xgrok-client-web  && \
    npm  install && \
    npm run build:web-client

RUN cd xgrok\xgrok-client && \
    cp -rp dist ..\xgrok-client-web\web && \
    cd xgrok\xgrok-client-web && \
    npm run prod
