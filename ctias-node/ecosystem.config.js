// todo : 서울 사무실에서는 CTIAS_ENV 를 'seoul'로 변경해야함

module.exports = {
  apps : [{
    name: 'CTIAS_API',
    script: 'expressApp.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: ["pages", "express_router", "expressApp.js"],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      CTIAS_ENV: 'jeju'
    },
    env_production: {
      NODE_ENV: 'production',
      CTIAS_ENV: 'jeju'
    }
  }],

  // deploy : {
  //   production : {
  //     user : 'node',
  //     host : '212.83.163.1',
  //     ref  : 'origin/master',
  //     repo : 'git@github.com:repo.git',
  //     path : '/var/www/production',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};
