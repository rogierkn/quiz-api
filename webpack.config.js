var path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

console.log(path.join(__dirname, 'assets/js/theme/theme.config'));

module.exports = {
    // devtool: 'source-map',
    entry: [
        './assets/js/index.tsx'
    ],
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        historyApiFallback: {
            index: 'index.html',
        }
    },
    output: {
        path: path.join(__dirname, 'public/'),
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: '[name].css'
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '../../theme.config$': path.join(__dirname, 'assets/js/theme/theme.config')
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                include: path.join(__dirname, 'assets/js/')
            },
            {
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'less-loader']
                }),
                test: /\.less$/
            },
            // { // CSS
            //     test: /\.css$/,
            //     use: ['style-loader', 'css-loader']
            // },
            { // Images etc
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            {
                test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
                loader: require.resolve('file-loader'),
                options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
        ]
    }
};
