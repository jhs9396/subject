const express = require('express');
const path = require('path');
// const next = require('next')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet')
const csp = require('helmet-csp')
const PORT = process.env.PORT || 3000
// const dev = process.env.NODE_DEV !== 'production' //true false
// const nextApp = next({ dev })
// const handle = nextApp.getRequestHandler() //part of next config

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const protoRouter = require('./src/routes/api_proto');
const keywordRouter = require('./src/routes/api_keyword');
const patternRouter = require('./src/routes/api_pattern');
const metaRouter = require('./src/routes/api_meta');
const expandRouter = require('./src/routes/api_expand');
const bookmarkRouter = require('./src/routes/api_bookmark');
const searchRouter = require('./src/routes/api_search');

function logErrors (err, req, res, next) {
    console.error(err.stack)
    next(err)
}

function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' })
    } else {
        next(err)
    }
}

function errorHandler (err, req, res, next) {
    res.status(500)
    res.send({ error: err.stack })
}



const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src/public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/proto', protoRouter)
app.use('/api/keyword', keywordRouter)
app.use('/api/pattern', patternRouter)
app.use('/api/meta', metaRouter)
app.use('/api/expand', expandRouter)
app.use('/api/bookmark', bookmarkRouter)
app.use('/api/search', searchRouter)

app.use(helmet())
app.disable('x-powered-by')

// 에러 핸들러
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

app.listen(PORT, err => {
    if (err) throw err;
    console.log(`ready at http://localhost:${PORT}`)
})

