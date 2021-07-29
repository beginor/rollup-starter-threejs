#!/bin/bash -e
rm -rf dist/libs && mkdir -p dist/libs
# tslib
mkdir dist/libs/tslib
cp -v node_modules/tslib/tslib.es6.js dist/libs/tslib/tslib.js
npx rollup -c rollup/rollup.tslib.js
# bootstrap-icons
cp -rv node_modules/bootstrap-icons/icons dist/libs/bootstrap-icons
# bootstrap
mkdir dist/libs/bootstrap
cp -v node_modules/bootstrap/dist/css/bootstrap.min.css dist/libs/bootstrap
cp -v node_modules/bootstrap/dist/js/bootstrap.esm.js dist/libs/bootstrap
cp -v node_modules/bootstrap/dist/js/bootstrap.esm.min.js dist/libs/bootstrap
# @popperjs/core
npx rollup -c rollup/rollup.popperjs.js
# three.js
mkdir dist/libs/three
cp -v node_modules/three/build/three.module.js dist/libs/three
npx terser --comments false --module -o dist/libs/three/three.module.min.js dist/libs/three/three.module.js
mkdir dist/libs/three/examples
cp -rv node_modules/three/examples/fonts dist/libs/three/examples
cp -rv node_modules/three/examples/jsm dist/libs/three/examples
