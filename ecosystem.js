module.exports = {
    "apps": [
        {
            "args": "node ./dist/main.js",
            "exec_mode": "cluster",
            "instances": 1,
            "interpreter": "bash",
            "name": "30Days-App-Server",
            "script": "yarn",
            "time": true
        }
    ],

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