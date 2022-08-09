## System tests for @heusalagroup/hg-dashboard

### Install

```shell
npm install
```

### Run system tests

***WARNING!*** Our tests will modify the database heavily and also delete every existing workspace.

```shell
npm test
```

### Troubleshooting

#### `connect ECONNREFUSED 127.0.0.1:3500`

The backend is not running at port 3500. Is the backend service up?

See [Starting environment](https://github.com/heusalagroup/hg-dashboard#starting-environment).
