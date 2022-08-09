# @heusalagroup/hg-dashboard

HG's Dashboard Project to bootstrap full stack TypeScript projects.

## Working on the local development environment

### Fetching source code

```bash
git clone git@github.com:hangovergames/hg-dashboard.git hg-dashboard
cd hg-dashboard
git submodule update --init --recursive
```

### Building full local environment for testing

This environment uses Synapse Matrix Server to save persistent data to PostgreSQL 
database.

```bash
docker-compose build
```

### Starting local development environment

This is the easiest way to run the full environment.

```bash
docker-compose up
```

### Starting local development environment using memory based repository 

The memory based repository saves everything on local memory. It's faster, but doesn't
persist any state between runs. Usable just for development.

```bash
docker-compose -f ./docker-compose.memory.yml build
docker-compose -f ./docker-compose.memory.yml up
```

### Starting production environment

This is the easiest way to run the full environment.

```bash
DOCKER_HOST_IP=172.16.50.54 \
BACKEND_JWT_SECRET='secret-code' \
BACKEND_IO_SERVER='https://user:secret@io.hg.fi' \
BACKEND_EMAIL_CONFIG='smtp://host.docker.internal:25'
docker-compose -f docker-compose.prod.yml up -d
```

### Initializing environment

You'll need to create an account for the application on the IO server.

This needs to be run only once -- until you clean up your `./io/data/homeserver.db`:

```bash
docker exec -it hg-dashboard-io register_new_matrix_user http://localhost:8008 -c /data/homeserver.yaml --no-admin -u app -p p4sSw0rd123
```

Once added, you'll need to start the backend again:

```bash
docker restart hg-dashboard-backend
docker restart hg-dashboard-nginx
```

### Initializing environment with Dendrite Matrix Server

If you're using `docker-compose.dendrite.yml`, use ([read more](https://github.com/matrix-org/dendrite/blob/main/docs/administration/1_createusers.md)):

```bash
docker exec -it hg-dashboard-io-dendrite /usr/bin/create-account -config /etc/dendrite/dendrite.yaml -username app -password p4sSw0rd123
```

Once added, you'll need to start the backend again:

```bash
docker restart hg-dashboard-backend
docker restart hg-dashboard-nginx
```

### Using the environment

Once services are running, following services are available:

* http://localhost:8080     -- The dashboard app in production mode (e.g. through Nginx HTTP server)
* http://localhost:8080/api -- The dashboard backend through Nginx HTTP server
* http://localhost:3500     -- Dashboard Backend Server (direct access)
* http://localhost:8025     -- Web UI for SMTP Server for development purposes (MailHog)
* http://localhost:8008     -- Matrix.org IO Server (Synapse or Dendrite)
* `smtp://localhost:1025`   -- SMTP server (MailHog)

Once you run `npm start` inside the frontend directory, the app will be available at:

* http://localhost:3000     -- The dashboard frontend in development mode
* http://localhost:3000/api -- The dashboard backend redirected to local port 3500

### Update all submodules

We have a script to update all changes from upstream git repositories.

```shell
./scripts/pull-all.sh
```

It will read `.gitmodules` and use it to fetch all submodules using `git pull` 
inside submodule folders. It will pull also the main git repository.

## Working on the Github

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
