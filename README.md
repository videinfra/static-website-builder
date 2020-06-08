`static-website-builder` is a customizable static site project builder powered by Gulp, Webpack, Babel, SASS, PostCSS, TwigJS, BrowserSync

## Features

- Gulp: built using gulp
- Built-in Server: Local development server with hot reloading
- Templates: HTML templates with minification
- TWIG: Optional TwigJS template engine with optional plugins for additional functions and filters
- Stylesheets: Autoprefixing and minification with PostCSS support 
- SASS: Optional SASS / SCSS compilation
- Javascript: Transpilation with Babel, bundling and minification
- SVG icons: Sprite generation from individual SVG files


* Paths: Source and destinations paths are configurable
* Features: All features can be configured or disabled
* Plugins: create additional plugins / gulp tasks

## Quick start

```
npm init
npm install @vig/static-website-builder --save
npx builder init
```

Start development server
```
npm run start
```

Build production files
```
npm run start
```

Note: these commands are added to the project during `npm init`.

## Commands

### Development server

```npx run builder```

### Generate production ready files

```npx run builder build```

## Project templates

As used in quick start, project templates are used to generate boilerplate / starter files and add commands to the project:

- `default` - simple template with normalize.scss


## Plugins

Built-in plugins:
- `sass` - adds `.sass` and `.scss` file rendering using SASS
- `twig` - adds `.twig` file rendering using TwigJS
- `twig/symfony-filters` - adds `humanize` filter as found in Symfony
- `twig/symfony-functions` - adds `asset` function as found in Symfony
- `twig/lodash-filters` - adds `omit`, `pick`, `filter`, `reject` and `find` filters as in lodash

Plugins can be enabled by adding them to the `config/config.js`, eg.

```js
exports.plugins = [
    // Enables SASS engine and .sass and .scss file compilation
    require('@videinfra/static-website-builder/plugins/sass'),

    // Enables TwigJS engine .twig file compilation
    require('@videinfra/static-website-builder/plugins/twig'),
    require('@videinfra/static-website-builder/plugins/twig/symfony-filters'),
    require('@videinfra/static-website-builder/plugins/twig/symfony-functions'),
    require('@videinfra/static-website-builder/plugins/twig/lodash-filters'),
];
```

## Wiki

See [our wiki](https://github.com/videinfra/static-website-builder/wiki) for additional information.
