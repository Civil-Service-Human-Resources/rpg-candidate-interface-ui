# ---- Base Node ----
FROM node:8-alpine AS base
# set working directory
WORKDIR /app
# copy project file
COPY package.json .

FROM base AS dependencies

ARG IS_DEV=false

# install prod node packages
RUN npm set progress=false && npm config set depth 0
RUN if [ "${IS_DEV}" = "false" ]; then \
        npm install --only=production && \
        cp -R node_modules prod_node_modules \
    ;fi

# install ALL node_modules, including 'devDependencies'
RUN npm install

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
