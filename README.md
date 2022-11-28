## Intelligent Construction Site - Vue.js

a simple vue.js front end for 'Intelligent Construction Site' project

See back end and ocr script for reference https://github.com/Song-Gq/intelli-construct-flask

#### Changes Needed

In `/src/main.js`

```js
let targetDomain = 'https://your.own.domain:443'
```

#### Dependency

In `package.json`, run the following scripts

```
"install-element": "npm i element-ui -S",
"install-axios": "npm i axios -S"
```

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
