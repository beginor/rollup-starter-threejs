import {
    Scene, WebGLRenderer, DataTexture3D, Texture, TextureLoader, ShaderMaterial,
    BoxBufferGeometry, Mesh, RawShaderMaterial, UniformsUtils, RedFormat,
    LinearFilter, FloatType, DoubleSide, OrthographicCamera
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { WEBGL } from 'three/examples/jsm/WebGL';
import { VolumeRenderShader1 } from 'three/examples/jsm/shaders/VolumeShader';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { NRRDLoader } from 'three/examples/jsm/loaders/NRRDLoader';
import { Volume } from 'three/examples/jsm/misc/Volume';

export class App {

    scene: Scene;
    camera: OrthographicCamera;
    renderer: WebGLRenderer;
    controls: OrbitControls;

    private colormaps = {
        Gray: 'cm_gray.png',
        Viridis: 'cm_viridis.png'
    };

    private config = {
        clim1: 0,
        clim2: 1,
        renderstyle: 'iso',
        isothreshold: 0.15,
        colormap: 'cm_viridis.png',
        volume: 'stent.nrrd'
    };

    private material: RawShaderMaterial;
    private mesh: Mesh;

    constructor(private container: HTMLElement) { }

    private init(): void {
        if (!WEBGL.isWebGL2Available()) {
            this.container.appendChild(WEBGL.getWebGL2ErrorMessage());
            return;
        }
        // Setup scene;
        this.scene = new Scene();
        // this.scene.background = new Color('#000000');
        // assign scene to window for debug;
        window['scene'] = this.scene;
        // Setup camera;
        var h = 512; // frustum height
        var aspect = window.innerWidth / window.innerHeight;
        this.camera = new OrthographicCamera(
            - h * aspect / 2, h * aspect / 2, h / 2, - h / 2, 1, 1000
        );
        this.camera.position.set(0, 0, 128);
        this.camera.up.set(0, 0, 1);
        // Setup camera control
        this.controls = new OrbitControls(this.camera, this.container);
        this.controls.target.set(64, 64, 128);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('webgl2');
        this.renderer = new WebGLRenderer({
            premultipliedAlpha: false,
            canvas,
            context
        });
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        )
        this.container.appendChild(this.renderer.domElement);
        this.setupGui();
        //
        this.updateVolume();
    }

    private update(time: number): void {
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
        // console.log(time);
    }

    private setupGui(): void {
        const gui = new GUI();
        gui.add(this.config, 'clim1', 0, 1, 0.01).onChange(() => this.updateUniforms());
        gui.add(this.config, 'clim2', 0, 1, 0.01).onChange(() => this.updateUniforms());
        gui.add(this.config, 'colormap', this.colormaps).onChange(() => this.updateUniforms());
        gui.add(this.config, 'renderstyle', { mip: 'mip', iso: 'iso' }).onChange(() => this.updateUniforms());
        gui.add(this.config, 'isothreshold', 0, 1, 0.01 ).onChange(() => this.updateUniforms());
    }

    private updateUniforms(): void {
        this.material.uniforms["u_clim"].value.set(this.config.clim1,this.config.clim2 );
        this.material.uniforms["u_renderstyle"].value = this.config.renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
        this.material.uniforms["u_renderthreshold"].value = this.config.isothreshold; // For ISO renderstyle
        this.material.uniforms["u_cmdata"].value = this.loadColormap(this.config.colormap);
        this.material.needsUpdate = true;
    }

    private updateVolume(): void {
        this.loadVolume(this.config.volume).then(volume => {
            this.onLoadVolume(volume);
        });
    }

    private loadVolume(volume: string): Promise<Volume> {
        return new Promise<Volume>((resolve, reject) => {
            const url = `./assets/volumes/${volume}`;
            const loader = new NRRDLoader();
            loader.load(
                url,
                vol => {
                    resolve(vol);
                },
                e => {},
                err => {
                    reject(err);
                }
            );
        });
    }

    private loadColormap(colormap: string): Texture {
        const url = `./assets/colormaps/${colormap}`;
        const loader = new TextureLoader();
        return loader.load(url);
    }

    private onLoadVolume(volume: Volume): void {
        if (this.mesh) {
            this.scene.remove(this.mesh);
        }
        const texture = new DataTexture3D(
            volume.data as any,
            volume.xLength,
            volume.yLength,
            volume.zLength
        );
        texture.format = RedFormat;
        texture.type = FloatType,
        texture.minFilter = texture.magFilter = LinearFilter;
        texture.unpackAlignment = 1;
        //
        const shader = VolumeRenderShader1;
        const uniforms = UniformsUtils.clone(shader.uniforms);
        const config = this.config;
        // console.log(config);
        uniforms[ "u_data" ].value = texture;
        uniforms[ "u_size" ].value.set( volume.xLength, volume.yLength, volume.zLength );
        uniforms[ "u_clim" ].value.set( this.config.clim1, this.config.clim2 );
        uniforms[ "u_renderstyle" ].value = this.config.renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
        uniforms[ "u_renderthreshold" ].value = this.config.isothreshold; // For ISO renderstyle
        uniforms[ "u_cmdata" ].value = this.loadColormap(this.config.colormap);
        //
        const material = new ShaderMaterial({
            uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: DoubleSide
        });
        this.material = material;
        //
        const geometry = new BoxBufferGeometry(
            volume.xLength,
            volume.yLength,
            volume.zLength
        );
        geometry.translate( volume.xLength / 2 - 0.5, volume.yLength / 2 - 0.5, volume.zLength / 2 - 0.5 );
        //
        const mesh = new Mesh(geometry, material);
        this.scene.add(mesh);
    }

}
