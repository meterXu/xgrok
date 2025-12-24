FROM hub.xdog.icu/node:22-bullseye-slim

COPY xgrok-client /workspace/xgrok-client
COPY xgrok-client-web /workspace/xgrok-client-web

WORKDIR /workspace/xgrok-client-web

RUN rm -rf src && \
    mkdir -p /xgrok/log && \
    mkdir -p /xgrok/conf

EXPOSE 8181

ENTRYPOINT ["npm","run","prod"]
