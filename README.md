Ushahidi Platform Web Client
============================

[![Greenkeeper badge](https://badges.greenkeeper.io/ushahidi/platform-client.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/ushahidi/platform-client.svg?branch=master)](https://travis-ci.org/ushahidi/platform-client)
[![Coverage Status](https://coveralls.io/repos/github/ushahidi/platform-client/badge.svg?branch=master)](https://coveralls.io/github/ushahidi/platform-client?branch=master)
[![Dependency Status](https://david-dm.org/ushahidi/platform-client/dev-status.svg?style=flat)](https://david-dm.org/ushahidi/platform-client#info=devDependencies)

___

## Try it out on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

You need to deploy the [Platform API](http://github.com/ushahidi/platform-comrades) first

# Platform Client installation

### What is the platform client?

The web client is the component that end users interact with when opening the Platform website with a web browser. The client interacts with the API in order to perform operations on the system \(i.e. submit posts, query posts\).

### Installation steps 

**Pre-requisite: Install the platform API by following one of the API setup guides**


**Pre-requisite: Install Node V6.x \(you might want to use NVM for this\) before continuing.**

#### **Getting the platform-client code**

Clone the repository \(this will create a directory named _platform-client\)_

```bash
git clone https://github.com/ushahidi/platform-client-comrades.git
```

Go into the platform directory

```bash
cd platform-client
```

Switch to the _develop_ branch

```bash
git checkout develop
```

**If you haven't used git before or need help with git specific issues, make sure to check out their docs here** [https://git-scm.com/doc](https://git-scm.com/doc)

#### Install the platform-client dependencies.

```
npm install
```

The client needs to point to the hostname where the backend expects to receive HTTP requests. This has to be set before building the client.

**In order to set up all that, create a file at the location /var/www/platform-client/.env . Use the following contents as an example:**

```
BACKEND_URL=http://192.168.33.110/
PORT=8000
APP_LANGUAGES=en
OAUTH_CLIENT_ID=ushahidiui
OAUTH_CLIENT_SECRET=35e7f0bca957836d05ca0492211b0ac707671261
```


To make it easy to call \`gulp\` when building and developing in the app, add **node\_modules/.bin** to your PATH in ~/_.bashrc_. Example PATH \(relevant part in bold\):

export PATH=$HOME/bin:/usr/local/bin:**node\_modules/.bin**:$PATH

```
gulp
```

alternatively, if you haven't setup node\_modules in your PATH, run:

### Running a local development server

Run:

```
node_modules/gulp/bin/gulp.js
```

This will start the watcher for local development, and any changes you make to the code will be reflected in the application.

### Building for production deployments

Run:

```
gulp build
```

alternatively, if you haven't setup node\_modules in your PATH, run:

```
node_modules/gulp/bin/gulp.js build
```

This will start the process of generating the static site. Once the files are generated, you can host the **server/www** directory and load the site.

In the **server** directory you will also find an example nginx and an example apache2 file to get you started on hosting the client.


#### Running unit tests

To run unit tests once, run:
```
gulp test
```

For test driven development we have a gulp task `gulp tdd`. This watches for JS changes and re-runs the unit tests.


### Native Server (Apache or Nginx)

If you are running the client with a native web server like Apache or nginx, you will need to use URL rewriting to point all non-existant files to `index.html`. There is a sample `.htaccess` file, which can be used with Apache:

```
% cp server/rewrite.htaccess server/www/.htaccess
```

Nginx users will have to manually configure rewriting in the site configuration file.

### Optional: Run Docker

*[Docker](https://www.docker.com/) is a very simple way to run applications in
completely separate server environments. Our Docker application runs a local
nginx server that serves the client as simply as possible, using the
[official Docker nginx server](https://registry.hub.docker.com/_/nginx/).*

To run the Docker container:

1. docker build -t ushahidi-client-server server
2. docker run --name=ushahidi-client -d -p 8080:80 ushahidi-client-server

Or using fig

1. `fig up`

This should bring

> **Note:** If you're on Linux you may have to add your user account (the user running docker commands)
> to the `docker` group. This prevents any need to run commands with `sudo`
>
> To check if `docker` group exist, issue `getent group | grep docker`. If the output of the command
> is empty, issue `sudo groupadd docker`
>
> Issue `sudo gpasswd -a ${USER} docker` to add the current logged in user to the `docker` group. Log out and then log back in to effect the changes.

**Note:** The first build of the Docker server can take several minutes. Wait till you see `server is live @ http://<ip_address_or_localhost/` before attempting to view the site.

## References
This is one of three repositories related to COMRADES deployment of Ushahidi, [which is being tested here](https://comrades-stg.ushahidi.com/views/map).
* This repo contains code for the deployment’s graphical user interface. The “development” branch is our sandbox and the “master” branch is production.
* The primary source code for the functionality of the platform can be found in the [“Platform-comrades” repo here](https://github.com/ushahidi/platform-comrades). The “development” branch is our sandbox and the “master” branch is production.
* The test deployment also connects to other web services. In the [comrades-service-proxy repo](https://github.com/ushahidi/comrades-service-proxy) you will find code for an intermediary proxy which uses [YODIE from the University of Sheffield](https://gate.ac.uk/applications/yodie.html) to annotate posts in the COMRADES test Platform.
* The project website for this [COMRADES H2020 European Project](http://www.comrades-project.eu) can be found here. It contains a variety of outputs from the project such as [specific documentation within reports](http://www.comrades-project.eu/outputs/deliverables.html), access to our training [data and ontologies](http://www.comrades-project.eu/outputs/datasets-and-ontologies.html), and [academic research](http://www.comrades-project.eu/outputs/papers.html). 

## Acknowledgment
This work has received support from the European Union’s Horizon 2020 research and innovation programme under [grant agreement No 687847](http://cordis.europa.eu/project/rcn/198819_en.html).
