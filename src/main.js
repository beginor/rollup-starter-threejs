import { App } from './app/app.js'

import './main.css';

const appEl: HTMLElement = document.getElementById('app');
const app = new App(appEl);
app.run();
