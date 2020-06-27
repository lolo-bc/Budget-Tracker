const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  // Update the entry point
  entry: "./public/index.js",  
  
  output: {
    // Set the path and filename for the output bundle (hint: You will need to use "__dirname")
    path:  __dirname + "/public/dist/",
    filename: "bundle.js"
  },

  mode: "development",
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    }]
  },
  plugins: [
    new WebpackPwaManifest({
      filename: "manifest.json",
      injection: false,
      name: "Budget Tracker",
      short_name: "Budget Tracker",
      icons: [
          {
            "src": "public/icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "public/icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
        
        ],
        theme_color: "#ffffff",
        background_color: "blue",
        start_url: "/",
        display: "standalone"
    })
  ]
};

module.exports = config;
