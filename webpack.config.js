const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/entry-client.tsx', // Your widget's entry file
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'widget.js',
        // Configure your bundle as a UMD (Universal Module Definition) library if needed:
        library: 'Widget',
        libraryTarget: 'umd',
        globalObject: 'this', // Important for UMD builds in non-browser environments
    },
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'), // <-- This resolves '@/pages/ChatPage' to '<project_root>/src/pages/ChatPage'
        },
        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
        fallback: {
            // Provide a fallback for the Node "process" global variable.
            process: require.resolve('process/browser'),
        },
    },
    plugins: [
        // Automatically provide the process polyfill.
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,  // Matches .js, .jsx, .ts, and .tsx files.
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            // Optionally include preset-env for broader environment support
                            ['@babel/preset-env', { targets: "defaults" }],
                            [
                                '@babel/preset-typescript',
                                {
                                    isTSX: true,      // Enable TSX parsing for .tsx files
                                    allExtensions: true // Allow all file extensions to contain TSX
                                }
                            ],
                            [
                                '@babel/preset-react',
                                { runtime: 'automatic' } // Use the new JSX transform (React 17+ / 19)
                            ]
                        ]
                    },
                },
            },
            // Add this new rule to process CSS files
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
}; 