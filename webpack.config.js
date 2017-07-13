'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const extractCSS = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const path = require('path');

module.exports = {
    context: path.join(__dirname, "themes", "udelta", "assets"),

    entry: {
        index: './index',
        archive: './archive',
        category: './category',
        page: './page',
        post: './post',
        tag: './tag',
        tags: './tags',
        commons: './commons'
    },

    output: {
        path: path.join(__dirname, "public"),
        publicPath: '/',
        filename: 'assets/js/[name].js'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', ".json"]
    },
    resolveLoader: {
        modules: ["node_modules"],
        extensions: [".js", ".json"],
        mainFields: ["loader", "main"],
        moduleExtensions: ['-loader']
    },
    module: {

        loaders: [{
            test: /\.js$/,
            include: path.join(__dirname, "themes", "udelta", "assets"),
            loader: "babel?presets[]=es2015"
        },
        // {
        //     test: /\.(sass|scss)$/,
        //     loader: 'css?modules=true!sass'
        // }, {
        //     test: /\.(css)$/,
        //     loader: 'css'
        // }, 
        {
            test: /\.(sass|scss)$/,
            loader: extractCSS.extract('css!sass')
        },
        {
            test: /\.(css)$/,
            loader: extractCSS.extract('css')
        },

        {
            test: /\.(png|jpg|svg|gif)$/,
            loader: 'file?name=assets/images/[name].[ext]'
        },
        {
            test: /\.(ttf|eot|woff|woff2)$/,
            loader: 'file?name=assets/fonts/[path][name].[ext]'
        },
    
        ]

    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new extractCSS({ filename: 'assets/css/[name].css', allChunks: true }),
        new webpack.ProvidePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            //$: 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "commons",
            minChunks: 2
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    // watch: NODE_ENV == 'development',

    // watchOptions: {
    //     aggregateTimeout: 100
    // },
    // devServer: {
    //     contentBase: path.join(__dirname, "public", "udelta", "assets")
    //     // hot: true

    // },
    devServer: {
        contentBase: path.join(__dirname, "public"),
        publicPath: "/",
        port: 9000,
        proxy: {
            "/": "http://localhost:4000"
        }
    }
};