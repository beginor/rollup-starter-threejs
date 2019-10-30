import {
    Scene, PerspectiveCamera, WebGLRenderer, Color, Points, Geometry, Vector3,
    Quaternion, PointsMaterial, SphereGeometry, MeshBasicMaterial, Mesh, TextureLoader
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class App {

    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    controls: OrbitControls;

    points: Points;
    speeds: Quaternion[] = [];
    MaxPoints = 100000;

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
        this.createEarth();
        this.createPoints();
    }

    private update(time: number): void {
        this.updatePoints(time);
    }

    public run(): void {
        this.init();
        this.animate(0);
    }

    private animate(time: number): void {
        const callback = this.animate.bind(this);
        requestAnimationFrame(callback);
        this.update(time);
        this.renderer.render(this.scene, this.camera);
    }

    private createEarth() {
        const sphereGeometry = new SphereGeometry(1.99, 360, 180);
        const sphereMaterial = new MeshBasicMaterial({
            map: new TextureLoader().load('land_ocean_ice_2048.jpg'),
            wireframe: false,
            wireframeLinewidth: 1
        });
        const sphere = new Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(sphere);
    }

    private createPoints(): void {
        // points geometry;
        const geometry = new Geometry();
        const yaxis = new Vector3(0, 1, 0);
        let i = 0;
        while (geometry.vertices.length < this.MaxPoints) {
            const x = Math.random() * 4 - 2;
            const y = Math.random() * 4 - 2;
            const radius = x * x + y * y;
            if (radius < 4) {
                let z = Math.sqrt(4 - radius);
                z = i % 2 == 0 ? z : -z;
                i++;
                // verts
                const vert = new Vector3(x, y, z);
                geometry.vertices.push(vert);
                // angle speeds
                const angle = 0.001 + Math.random() / 50.0;
                const speed = new Quaternion();

                speed.setFromAxisAngle(yaxis, angle);
                this.speeds.push(speed);
            }
        }
        // points material
        const material = new PointsMaterial({
            color: 0xff0000,
            size: 3,
            transparent: true,
            sizeAttenuation: false
        });
        // points;
        this.points = new Points(geometry, material);
        this.scene.add(this.points);
    }

    private updatePoints(time: number): void {
        const geometry = this.points.geometry as Geometry;
        const vertices = geometry.vertices;
        for (let i = 0; i < vertices.length; i++) {
            vertices[i].applyQuaternion(this.speeds[i]);
        }
        geometry.verticesNeedUpdate = true;
    }

}
