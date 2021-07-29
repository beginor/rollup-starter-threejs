import {
    Scene, PerspectiveCamera, WebGLRenderer, Color
} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import './app.scss';

export class App {

    /** app title */
    public title = '';

    private scene!: Scene;
    private camera!: PerspectiveCamera;
    private renderer!: WebGLRenderer;
    private controls!: OrbitControls;
    private stats!: Stats;

    constructor(private container: HTMLElement) { }

    /**
     * run the app.
     */
    public run(): void {
        this.init();
        this.animate(0);
    }

    private init(): void {
        // Setup scene;
        this.scene = new Scene();
        this.scene.background = new Color('#000000');
        // assign scene to window for debug;
        Object.assign(window, { _scene: this.scene })
        // Setup camera;
        this.camera = new PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        // Setup camera control
        this.controls = new OrbitControls(this.camera, this.container);
        this.renderer = new WebGLRenderer({
            premultipliedAlpha: false
        });
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        );
        this.container.appendChild(this.renderer.domElement);
        this.stats = Stats();
        this.container.appendChild(this.stats.dom);
    }

    private update(time: number): void {
    }

    private animate(time: number): void {
        if (!this.renderer) {
            return;
        }
        if (!this.scene) {
            return;
        }
        if (!this.camera) {
            return;
        }
        if (!this.stats) {
            return;
        }
        const callback = this.animate.bind(this);
        requestAnimationFrame(callback);
        this.update(time);
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }

}
