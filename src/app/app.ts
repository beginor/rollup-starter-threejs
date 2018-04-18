import {
    Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry,
    MeshNormalMaterial, Mesh
} from 'three';

export class App {

    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    cube: Mesh;

    constructor(private container: HTMLElement) {
    }

    private init(): void {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        )
        this.container.appendChild(this.renderer.domElement);

        var geometry = new BoxGeometry(1, 1, 1);
        var material = new MeshNormalMaterial();
        this.cube = new Mesh(geometry, material);
        this.scene.add(this.cube);

        this.camera.position.z = 5;
    }

    private update(time: number): void {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.02;
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
