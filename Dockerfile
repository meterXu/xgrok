FROM hub.xdog.icu/node:22-bullseye-slim


RUN mkdir -p /xgrok-client/src && \
    mkdir -p /xgrok-client/node_modules

COPY xgrok-client/src /xgrok-client/src
COPY xgrok-client/node_modules/electron /xgrok-client/node_modules/electron
COPY xgrok-client/node_modules/node-machine-id /xgrok-client/node_modules/node-machine-id
COPY xgrok-client/node_modules/node-port-check /xgrok-client/node_modules/node-port-check
COPY xgrok-client/node_modules/auto-launch /xgrok-client/node_modules/auto-launch
COPY xgrok-client/node_modules/http-proxy /xgrok-client/node_modules/http-proxy
COPY xgrok-client/node_modules/path-is-absolute /xgrok-client/node_modules/path-is-absolute
COPY xgrok-client/node_modules/yaml /xgrok-client/node_modules/yaml
COPY xgrok-client/node_modules/eventemitter3 /xgrok-client/node_modules/eventemitter3
COPY xgrok-client/node_modules/requires-port /xgrok-client/node_modules/requires-port
COPY xgrok-client/node_modules/axios /xgrok-client/node_modules/axios
COPY xgrok-client/node_modules/form-data /xgrok-client/node_modules/form-data
COPY xgrok-client/node_modules/combined-stream /xgrok-client/node_modules/combined-stream
COPY xgrok-client/node_modules/delayed-stream /xgrok-client/node_modules/delayed-stream
COPY xgrok-client/node_modules/mime-types /xgrok-client/node_modules/mime-types
COPY xgrok-client/node_modules/mime-db /xgrok-client/node_modules/mime-db
COPY xgrok-client/node_modules/asynckit /xgrok-client/node_modules/asynckit
COPY xgrok-client/node_modules/rimraf /xgrok-client/node_modules/rimraf
COPY xgrok-client/node_modules/proxy-from-env /xgrok-client/node_modules/proxy-from-env

COPY xgrok-client-web /xgrok

WORKDIR /xgrok

RUN rm -rf src && \
    rm -rf execute\darwin && \
    rm -rf .env.development && \
    rm -rf .env.template


EXPOSE 8181

ENTRYPOINT ["npm","run","prod"]
