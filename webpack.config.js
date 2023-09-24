const path = require('path')
const Dotenv = require('dotenv-webpack')
module.exports = {
    mode: 'production', 
    entry: './src/index.js',
    plugins: [new Dotenv()],
    output: {
        path: path.resolve(__dirname, 'pub'),
        filename: 'bundle.js'
    },
    watch: false
}