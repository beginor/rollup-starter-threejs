import {
    Scene, PerspectiveCamera, WebGLRenderer, Color
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class App {

    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    controls: OrbitControls;

    constructor(private container: HTMLElement) {
    }

    private init(): void {
        // Setup scene;
        this.scene = new Scene();
        this.scene.background = new Color("#000000");
        // assign scene to window for debug;
        window['scene'] = this.scene;
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
        )
        this.container.appendChild(this.renderer.domElement);
    }

    private update(time: number): void {
    }

    private animate(time: number): void {
        const callback = this.animate.bind(this);
        requestAnimationFrame(callback);
        this.update(time);
        this.renderer.render(this.scene, this.camera);
    }

    public run(): void {
        this.init();
        this.animate(0);
    }

}
