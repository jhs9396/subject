var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'src/public/js');
var APP_DIR = path.resolve(__dirname, 'src/app');

console.log(BUILD_DIR);
console.log(APP_DIR);

var config = {
    devtool: "source-map",
    target: "web",
    // target: "node",
    mode: 'development',
    entry: {
        // "client"   : [APP_DIR + '/client_main.js'],
        "spam"   : [APP_DIR + '/spam_app.js'],
        // "graph_core" : [APP_DIR + '/util/graph/index.ts']
    },

    output: {
        path: BUILD_DIR,
        filename: '[name].js',
        libraryTarget: "var",
        // libraryTarget: "commonjs",
        library: '[name]'
    },

    resolve: {
        extensions: ['.styl','.json','.js','.ts']
    },
    module: {
        "rules": [
            {
                test: /\.worker\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                        // publicPath: '/js',
                        inline: true
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "stylus-loader" }
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
        ]
    },

    optimization: {
        minimize: true,
    },

    devServer: {
        // lazy: true,
        // filename: 'client.js',
        contentBase: path.resolve(__dirname, 'src/public'),
        publicPath: '/js',
        compress: true,
        port: 9000,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                secure: false
            },

            '/index.html': {
                target: 'http://localhost:3000',
            },
        }
    },
};

module.exports = config;
