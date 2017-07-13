'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const extractCSS = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const path = require('path');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

let svgoConfig = JSON.stringify({
    plugins: [{
        removeTitle: true
    }, {
        convertColors: {
            shorthex: false
        }
    }, {
        convertPathData: true
    }]
});


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
    target: 'web',
    module: {
        // configuration regarding modules

        rules: [
            // rules for modules (configure loaders, parser options, etc.)
            { // Javascript
                test: /\.js$/,
                include: path.join(__dirname, "themes", "udelta", "assets"),
                use: "babel?presets[]=es2015"
            }, { // SCSS в файлы
                test: /\.(sass|scss)$/,
                use: extractCSS.extract('css!sass')
            }, { // CSS в файлы 
                test: /\.(css)$/,
                use: extractCSS.extract('css')
            },

            { // Картинки 
                test: /\.(png|jpg|svg|gif)$/,
                exclude: path.join(__dirname, "themes", "udelta", "assets", "icons"),
                use: 'file?name=assets/images/[name].[ext]'
            }, { // Копируем шрифты
                test: /\.(ttf|eot|woff|woff2)$/,
                use: 'file?name=assets/fonts/[path][name].[ext]'
            }, {
                test: /\.svg$/,
                include: path.join(__dirname, "themes", "udelta", "assets", "icons"),
                use: [
                    
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'assets/icons/icons-sprite.svg'
                        }
    
                    },
                    {
                        loader: 'svgo-loader?' + svgoConfig
                    }
                ]
            }

        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new extractCSS({
            filename: 'assets/css/[name].css',
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            //$: 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "commons",
            minChunks: 2
        }),
        new webpack.HotModuleReplacementPlugin(),
        new SpriteLoaderPlugin()
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
