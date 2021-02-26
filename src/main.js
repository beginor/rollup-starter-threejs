import { App } from './app/app.js'

import './main.css';

const appEl = document.getElementById('app');
if (!!appEl) {
    const app = new App(appEl);
    app.run();
}
