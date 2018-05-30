# ---- Base Node ----
FROM node:9-alpine AS base
# set working directory
WORKDIR /app
# copy project file
COPY package.json .

FROM base AS dependencies

ARG IS_DEV=false

run apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install --quiet node-gyp -g &&\
  npm install --quiet && \
  apk del native-deps

# install prod node packages
RUN npm set progress=false && npm config set depth 0
RUN if [ "${IS_DEV}" = "false" ]; then \
        npm install --force --only=production && \
        cp -R node_modules prod_node_modules \
    ;fi

# install ALL node_modules, including 'devDependencies'
RUN npm install

#
# ---- Test ----
# run linters, setup and tests
#FROM dependencies AS test
#COPY . .
#RUN npm run test

#
# ---- Release ----
FROM base AS release

WORKDIR /app

ARG IS_DEV=false

RUN if [ "${IS_DEV}" = "false" ]; then \
        export MODULES_DIR=prod_node_modules \
    ;else \
        export MODULES_DIR=node_modules \
    ;fi

# copy production node_modules
COPY --from=dependencies /app/${MODULES_DIR} ./
# copy app sources
COPY . .
# expose port and define CMD
EXPOSE 3000

CMD npm run start
