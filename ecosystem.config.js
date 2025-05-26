module.exports = {
  apps: [{
    name: 'vps-script',
    script: 'script.js',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    restart_delay: 10000,
    max_restarts: 5,
    min_uptime: '30s',
    cron_restart: '0 3 * * *',
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};