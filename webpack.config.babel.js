const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: ['./src/app.js','./public/css/main.css'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    watch : true,
    //cache: false,

    
    module:{
        loaders: [
            {
                test:/\.js$/,
                exclude:/node_modules/,
                loader:'babel-loader',
                query:{
                    presets: ['react', 'env', 'stage-1']
                }
            },
            { 
                test: /\.css$/, 
                loader: "style-loader!css-loader" 
            },
        ]
    }
}