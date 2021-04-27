import './main.css';

import('./app/app').then(m => {
    const app = new m.App(document.getElementById('app'));
    app.run();
}).catch(ex => {
    console.error(ex);
});
