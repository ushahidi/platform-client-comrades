FROM node:6.9.1

RUN apt-get update && apt-get install -y rsync && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN git config --global url."https://github.com/".insteadOf git@github.com:

RUN NPM_CONFIG_PROGRESS=false npm install --silent -g gulp@3.9.0 gulp-notify@2.2.0 grunt-cli@0.1.13 > /dev/null 2>&1

RUN mkdir -p /var/app
WORKDIR /var/app
COPY package.json /var/app
RUN NPM_CONFIG_PROGRESS=false npm install --silent > /dev/null 2>&1 || \
    { tail -n 1000 npm-debug.log ; false ; }

COPY docker/build.run.sh /build.run.sh

ENTRYPOINT [ "/bin/bash", "/build.run.sh" ]
