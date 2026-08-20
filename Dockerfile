FROM docker.1ms.run/node:22-bullseye-slim


RUN mkdir -p /xgrok-client/src && \
    mkdir -p /xgrok-client/node_modules

COPY xgrok-client/src /xgrok-client/src
COPY xgrok-client/node_modules /xgrok-client/node_modules
COPY xgrok-client-web /xgrok

WORKDIR /xgrok

RUN rm -rf src && \
    rm -rf execute\darwin && \
    rm -rf .env.development && \
    rm -rf .env.template && \
    rm -rf /xgrok-client/node_modules/element-plus && \
    rm -rf /xgrok-client/node_modules/app-builder-bin  && \
    rm -rf /xgrok-client/node_modules/typescript  && \
    rm -rf /xgrok-client/node_modules/@babel  && \
    rm -rf /xgrok-client/node_modules/javascript-obfuscator && \
    rm -rf /xgrok-client-web/execute/darwin


EXPOSE 8181

ENTRYPOINT ["npm","run","prod"]
