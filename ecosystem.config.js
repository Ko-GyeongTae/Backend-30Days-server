module.exports = {
    apps: [{
        name: '30Days',
        script: '/dist/main.js',
        instances: 1,
        autorestart: true,
        watch: false,
        env: {
            NODE_ENV: 'production'
        }
    }],

    deploy: {
        production: {
            user: 'node',
            host: '122.34.166.121',
            ref: 'origin/master',
            repo: 'https://github.com/Ko-GyeongTae/Backend-30Days-server.git',
            path: '/home/ko/Document/Backend-30Days-server',
            'post-deploy': 'yarn && pm2 reload ecosystem.config.js --env production'
        }
    }
};