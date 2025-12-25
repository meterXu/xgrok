FROM hub.xdog.icu/node:22-bullseye-slim

COPY xgrok-client /xgrok-client
COPY xgrok-client-web /xgrok

WORKDIR /xgrok

RUN rm -rf src && \
    rm -rf .env.development && \
    rm -rf .env.template

EXPOSE 8181

ENTRYPOINT ["npm","run","prod"]
