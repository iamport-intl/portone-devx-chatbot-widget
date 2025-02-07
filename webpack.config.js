const path = require('path');

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
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,  // This will match .js, .jsx, .ts, and .tsx files.
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-react',      // Transpile JSX
                            '@babel/preset-typescript'  // Transpile TS/TSX
                        ],
                    },
                },
            },
        ],
    },
    // Add a resolve block specifying file extensions and module directories.
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'), // <-- This resolves '@/pages/ChatPage' to '<project_root>/src/pages/ChatPage'
        },
        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    },
    performance: {
        hints: false, // Disable performance hints (if desired)
    },
    // Remove or comment out the externals so React is bundled with your widget:
    // externals: {
    //   react: 'React',
    //   'react-dom': 'ReactDOM',
    // },
}; 