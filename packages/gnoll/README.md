# Gnoll :japanese_ogre:

Tool for fast and easy bootstraping Webpack & React projects. 

- It can build code in production and development modes,
and perform other tasks like linting and formatting.
- It includes all required dependencies, so you don't need to install them manually.
- It contains default configuration, but if you need to change some settings,
you can override them in your project.

## Install

```
npm install gnoll
```

## Commands

Gnoll has command line interface. You can add commands to your `package.json` file:

```json
{
  "scripts": {
    "start": "gnoll start",
    "build": "gnoll build",
    "lint": "gnoll lint"
  }
}
```

### build [--config path] \[--caching]

Creates optimized production build.

It builds entry `src/index.js` and outputs results to `dist` dir.
You can read in next section what is included in default config.
<br>
If you want to change something, for example, add plugins or loaders,
you can extend default config by creating `webpack.config.js` in your project.

```js
// webpack.config.js

// default config
let config = require('gnoll/config/webpack')

// add plugin
config.plugins.push(plugin)

// add loader
config.module.rules.push({
    test: /\.smth$/,
    loader: 'some-loader'
})

module.exports = config
```

**`--config path`**
<br>
This option allows to provide path to different webpack config file.

**`--caching`**
<br>
This option optimizes build for long term caching of static assets.
<br>
Optimizations are based on this guide from webpack documentation -
https://webpack.js.org/guides/caching/

- It includes hash of file content in its filename.
This allows to cache files forever, because changed files will always have different names.
- Extracts webpack runtime into separate entry chunk `runtime`, because it can change on rebuild.
- Generates `manifest.json` file that maps original filenames to hashed ones.

Also, it is common practice to separate some vendor modules to separate bundle.
You can do it by extending webpack config file in your project like this:

```js
config.entry = {
    main: './src/index.js',
    vendor: ['react', 'react-dom']
}

// Note that the plugin is added to the beginning.
// It is important to insert it before CommonsChunkPlugin that extracts 'runtime'
config.plugins.unshift(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity
}))
```

### watch [--config path]

Creates development build and rebuild on changes.

### start [--config path]

Starts webpack development server.

If you have file `src/index.html` in your project, it will be included
using `html-webpack-plugin` and served on dev-server with automatically injected assets.

### lib [--watch] [--source-maps]

Use this command if you want to build library that should provide modules.
<br>
When building library, js files are compiled by Babel.
Format of the modules is changed to CommonJS.
All other files are copied as is. Result is placed in the `lib` directory.

**`--watch`**
<br>
Starts watcher that recompiles files on changes.

**`--source-maps`**
<br>
Embed inline source maps into compiled files.

### lint

Checks source code with [ESLint](https://eslint.org).

Default config is based on `eslint-config-airbnb` with addition of `eslint-config-prettier`,
which removes all rules related to formatting and replaces them with rule
that gives error when source code doesn't match autoformatted output from the Prettier.

If you need to integrate linting with your IDE or editor plugin, you should
create `.eslintrc.js` file in your project and extend the default config like this:

```js
// .eslintrc.js
module.exports = {
    extends: [
        './node_modules/gnoll/config/eslint.js'
    ]
}
```

Also, you can override any ESLint settings in this file, if you want.

If you want to change Prettier settings, you can create `.prettierrc` (JSON format)
or `prettier.config.js` (JS module) in your project.

## Included loaders

### Javascript

Javascript is compiled using Babel.
<br>
In addition to ES6 syntax features, it also supports:

- Unfinished proposals to the ES standard
	([`babel-preset-stage-0`](https://babeljs.io/docs/plugins/preset-stage-0/))
- JSX syntax
- Decorators ([`babel-plugin-transform-decorators-legacy`](
	https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy))

When building for production code is minified by UglifyJS.

### Static files

These formats are built using `file-loader`:

- images: `png` `svg` `jpg` `jpeg` `gif` `webp`
- fonts: `eot` `ttf` `woff` `woff2`
- media: `mp4` `ogg` `webm` `mp3`