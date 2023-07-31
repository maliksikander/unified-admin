# # FROM gitlab.expertflow.com:9242/general/node:12-alpine-3.12
# FROM node:14.16.1-alpine3.13
# RUN apk update && apk upgrade

# RUN apk add tzdata gettext

# RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

# WORKDIR /usr/src/app

# COPY package.json yarn.lock ./

# USER node

# RUN yarn install --pure-lockfile

# COPY --chown=node:node . .

# RUN chmod 755 ./docker-entrypoint.sh

# ENTRYPOINT ["./docker-entrypoint.sh"]

FROM gitlab.expertflow.com:9242/general/node:CSN-3623

WORKDIR /usr/src/app

COPY . .

#RUN apk add gettext

RUN apk add tzdata gettext

EXPOSE 3000

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
