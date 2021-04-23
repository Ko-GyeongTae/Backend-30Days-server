module.exports = {
    apps: [{
        name: '30Days',
        script: 'yarn',
        args: 'start',
        interpreter: '/bin/bash',
        env: {
            NODE_ENV: 'development'
        }
    }]
};