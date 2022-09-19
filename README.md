# @heusalagroup/hg-dashboard

HG's Dashboard Project to bootstrap full stack TypeScript projects.

## Working on the local development environment

### Fetching source code

```shell
git clone git@github.com:heusalagroup/hg-dashboard.git hg-dashboard
cd hg-dashboard
git submodule update --init --recursive
```

### Building local environment

```shell
docker-compose build
```

### Local environment using non-persistent memory repository 

The memory based repository saves everything to non-persistent local memory. 

It's faster, but doesn't persist any state between runs. It also doesn't need 
any initialization tasks.

```shell
docker-compose -f ./docker-compose.memory.yml build
docker-compose -f ./docker-compose.memory.yml up
```

However, it's useful only for development.

### Local environment with Synapse server

Our default environment uses Synapse Matrix server to store persistent data to
PostgreSQL database.

Synapse is the official Matrix server. It's written using Python programming language.

#### Initializing Synapse server

You'll need to create an account for the application on the Synapse server before 
starting up everything.

First start up only your Matrix server:

```shell
docker-compose up -d hg-dashboard-io
```

This needs to be run only once -- and if you clean up your `./io/data/homeserver.db`:

```shell
docker exec -it hg-dashboard-io register_new_matrix_user http://localhost:8008 -c /data/homeserver.yaml --no-admin -u app -p p4sSw0rd123
```

Once added, you can stop the Matrix server:

```shell
docker-compose down -d hg-dashboard-io
```

#### Starting environment (with Synapse Matrix server)

```shell
docker-compose up
```

### Local environment with Dendrite Matrix server

Dendrite is another implementation for Matrix. It's written using Go programming
language.

#### Initializing Dendrite Matrix server

You'll need to create an account for the application on the Dendrite server before
starting up everything.

First start up only your Matrix server:

```shell
docker-compose -f ./docker-compose.dendrite.yml up -d hg-dashboard-io-dendrite
```

Then create the account for the app:

```shell
docker exec -it hg-dashboard-io-dendrite /usr/bin/create-account -config /etc/dendrite/dendrite.yaml -username app -password p4sSw0rd123
```

Once added, you can stop the Matrix server:

```shell
docker-compose -f ./docker-compose.dendrite.yml down -d hg-dashboard-io-dendrite
```

#### Starting environment (with Dendrite Matrix server)

```shell
docker-compose -f ./docker-compose.dendrite.yml up
```

### Using the development environment

#### Available Docker services

Once services are running, following services are available:

* http://localhost:8080     -- The dashboard app in production mode (e.g. through Nginx HTTP server)
* http://localhost:8080/api -- The dashboard backend through Nginx HTTP server
* http://localhost:3500     -- Dashboard Backend Server (direct access)
* http://localhost:8025     -- Web UI for SMTP Server for development purposes (MailHog)
* http://localhost:8008     -- Matrix.org IO Server (Synapse or Dendrite)
* `smtp://localhost:1025`   -- SMTP server (MailHog)

#### Development frontend

Once you run `npm start` inside the frontend directory, the app will be available at:

* http://localhost:3000     -- The dashboard frontend in development mode
* http://localhost:3000/api -- The dashboard backend redirected to local port 3500

#### Logging in to the dashboard

By default, only users using email addresses from accepted domains can log in and 
create initial workspaces.

You don't need to have access to the email address to use the development system.
Any email message the local system sends can be read from the MailHog interface 
at [localhost:8025](http://localhost:8025). The verification code is also printed 
on the server's debug log.

You can change this domain by changing `VALID_ADMIN_DOMAINS` array at 
`backend/src//fi/hg/dashboard/constants/dashboard-api.ts`. It defaults to the 
domain `example.fi` and `example.com`. You need to build the system again to make
the change work.

Once a user with another email address is added to a workspace they can log in 
to the system -- even if not using example domains.

### Update all git submodules

We have a script to update all changes from upstream git repositories.

```shell
./scripts/pull-all.sh
```

It will read `.gitmodules` and use it to fetch all submodules using `git pull` 
inside submodule folders. It will pull also the main git repository.

### Running tests

For testing, you need to have full docker environment running. 

Then open another terminal and go to the testing folder:

```shell
cd testing
```

#### Install testing environment

```shell
npm install
```

#### Running tests

```shell
npm test
```

## Working on the GitHub

Advices about working on GitHub environment.

### Find and set project on unlisted issues

Our issue templates do not set the project automatically. Because of that, it's
common that some issues are left unlisted on the board.

You can find unlisted issues with a search label `-project:PROJECT` where the `PROJECT` is `heusalagroup/1` for example.

 1. Go to [the Issues page](https://github.com/heusalagroup/hg-dashboard/issues?q=is%3Aissue+is%3Aopen+-project%3Aheusalagroup%2F1) (e.g. with `-project:heusalagroup/1`, any issue not in the MVP project)
 2. Select all found issues
 3. Set project as `MVP`

### Find and set unlabeled issues

Sometimes some issues are created without any labels.

1. Go to [the Issues page](https://github.com/heusalagroup/hg-dashboard/issues?q=is%3Aissue+is%3Aopen+no%3Alabel) (e.g. with `no:label`, any issue without label)
2. Select issues of specific type (e.g. `[Task]` in the title means tasks)
3. Set label to those types (e.g. `task` for tasks)

### Starting production environment

This is the easiest way to run the full environment.

```shell
DOCKER_HOST_IP=172.16.50.54 \
BACKEND_JWT_SECRET='secret-code' \
BACKEND_IO_SERVER='https://user:secret@io.hg.fi' \
BACKEND_EMAIL_CONFIG='smtp://host.docker.internal:25'
docker-compose -f docker-compose.prod.yml up -d
```

### Troubleshooting

#### Connection aborted / Failed to execute script docker-compose

```
docker.errors.DockerException: Error while fetching server API version: ('Connection aborted.', FileNotFoundError(2, 'No such file or directory'))
[8089] Failed to execute script docker-compose
```

You'll need to start up Docker Engine first :)
