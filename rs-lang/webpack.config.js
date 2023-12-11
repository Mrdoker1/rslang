const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const miniCss = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/index.ts',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')],
            },
            {
                test: /\.(s*)css$/,
                use: [
                    {
                        loader: miniCss.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                type: 'javascript/auto',
                options: {
                    outputPath: (url, resourcePath, context) => {
                        let relativePath = path.relative(context, resourcePath);
                        let targetPath = relativePath.substring(relativePath.indexOf(`\\`) + 1);
                        return targetPath;
                    },
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            dry: true,
            verbose: false,
            cleanStaleWebpackAssets: false,
        }),
        new HtmlWebpackPlugin({
            title: 'NewsPortal',
            filename: 'index.html',
            template: path.resolve(__dirname, './src/index.html'),
        }),
        new miniCss({
            filename: 'style.css',
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'src/assets', to: 'assets' }],
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public'),
    },
};
