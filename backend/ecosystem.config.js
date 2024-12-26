module.exports = {
  apps : [{
    name   : "dev",
    script : "dist/index.js",
    max_restarts: 5,
    wait_ready: true,
    env: {
      PORT: 8080,
      NODE_ENV: "development"
    },
  },
  {
    name   : "prod",
    script : "dist/index.js",
    max_restarts: 5,
    // wait_ready: true,
    env: {
      PORT: 8080,
      NODE_ENV: "production"
    },
  }]
}
