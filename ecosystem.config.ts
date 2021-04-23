module.exports = {
    apps: [{
        name: 'MyBlog',
        script: 'yarn',
        args: 'start',
        interpreter: '/bin/bash',
        env: {
            NODE_ENV: 'development'
        }
    }]
};