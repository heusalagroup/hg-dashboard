# @heusalagroup/hg-dashboard-backend

### Start Docker environment

This is the easiest way to run the backend.

```
docker-compose build
docker-compose up
```

Once running, services will be available:

* `localhost:1025` -- SMTP server
* http://localhost:3500 -- Dashboard Backend Server
* http://localhost:8025 -- Web UI for SMTP Server
* http://localhost:8008 -- Matrix.org IO Server

### Local development

If you only use Docker to run the backend and don't develop it, you don't need 
these commands.

#### Install dependencies

```
npm install
```

#### Build the server for release and/or production mode

```
npm run build
```

#### Start the server in production mode

```
npm run start-prod
```

...and open http://0.0.0.0:3000

#### Start the server in the development mode

**FIXME: This isn't working right now. Use production mode or Docker.**

```
npm start
```

