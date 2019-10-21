import {
    Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry,
    MeshNormalMaterial, Mesh, MeshBasicMaterial, TextureLoader,
    MeshStandardMaterial, MeshPhongMaterial, Color, PlaneBufferGeometry,
    DoubleSide
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class App {

    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    cube: Mesh;
    controls: OrbitControls;

    constructor(private container: HTMLElement) {
    }

    private init(): void {
        this.scene = new Scene();
        this.scene.background = new Color("#FFFF00");
        this.camera = new PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.renderer = new WebGLRenderer({
            antialias: false, alpha: true
        });
        this.renderer.autoClear = false;
        // this.renderer.autoClearColor = false;
        // this.renderer.autoClearDepth = false;
        // this.renderer.autoClearStencil = false;
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        )
        this.container.appendChild(this.renderer.domElement);
        var texture = new TextureLoader().load('./happy_santaclaus.png');
        var geometry = new BoxGeometry(1, 1, 1, 16, 16, 16);
        var material = new MeshBasicMaterial({
            map: texture,
            opacity: 0.9,
            transparent: true,
            wireframe: false
        });
        this.cube = new Mesh(geometry, material);
        // this.scene.add(this.cube);

        const planeGeo = new PlaneBufferGeometry(5, 5, 16, 16);
        const planeMat = new MeshBasicMaterial({
            // color: 0xff0000,
            side: DoubleSide,
            map: texture,
            transparent: true,
            opacity: 0.3
        });
        const plane = new Mesh(planeGeo, planeMat);
        this.scene.add(plane);

        this.camera.position.z = 5;
        this.controls = new OrbitControls(this.camera, this.container);
        window['scene'] = this.scene;
    }

    private update(time: number): void {
        // this.cube.rotation.x += 0.01;
        // this.cube.rotation.y += 0.02;
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
