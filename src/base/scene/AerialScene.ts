import BIM from "@/BIM";
import ConstDef from "@/libs/ConstDef";
import EventDef from "@/libs/EventDef";
import { AmbientLight, AxesHelper, BackSide, BoxGeometry, Color, CubeTextureLoader, DirectionalLight, FogExp2, GridHelper, Mesh, MeshBasicMaterial, MeshPhongMaterial, OrthographicCamera, PerspectiveCamera, PlaneBufferGeometry, Scene, ShaderLib, ShaderMaterial, SphereGeometry, Sprite, SpriteMaterial, sRGBEncoding, Texture, TextureLoader, Vector3, WebGLRenderer } from "three";
import OrthCameraCtrl from "../controller/OrthCameraCtrl";

/**
 * @description 3D鸟瞰场景
 * @author songmy
 */
export default class AerialScene implements IDispose {

    private readonly frustumSize: number = 10;
    /** 场景 */
    private _scene: Scene;
    /** 平面 */
    private _plane: Mesh;
    /** 辅助网格 */
    private _grid: GridHelper;
    /** 环境光 */
    private _ambLight: AmbientLight;
    /** 摄像机:透视 */
    private _pcamera: PerspectiveCamera;
    /** 摄像机:正交 */
    private _ocamera: OrthographicCamera;
    /** 当前使用的摄像机 */
    private _camera: any;
    /** 辅助坐标系 */
    private _axisHelper: AxesHelper;
    /** 渲染 */
    private _render: WebGLRenderer;
    /** 视口宽 */
    private _viewWidth: number;
    /** 视口高 */
    private _viewHeight: number;
    /** 位置指示 */
    private _posTips: Sprite;

    private _controls: OrthCameraCtrl;

    get scene(): Scene {
        return this._scene;
    }

    get camera(): any {
        return this._camera;
    }

    get render(): WebGLRenderer {
        return this._render;
    }

    get controls(): OrthCameraCtrl {
        return this._controls;
    }

    set viewWidth(value: number) {
        this._viewWidth = value;
    }

    get viewWidth(): number {
        return this._viewWidth;
    }

    set viewHeight(value: number) {
        this._viewHeight = value;
    }

    get viewHeight(): number {
        return this._viewHeight;
    }

    get PlaneMesh(): Mesh {
        return this._plane;
    }

    get posPoint(): Sprite {
        return this._posTips;
    }

    constructor() {
        this._viewWidth = window.innerWidth;
        this._viewHeight = window.innerHeight;
        this.createScene();
        this.createPCamera();
        this.createOCamera();
        this.createPlane();
        // this.createAxis();
        this.createGrid();
        this.createLight();
        this.createCenterPoint();

        this.createRender();
        this.createControls();
        this.addEvent();
    }

    private addEvent(): void {
        BIM.ED.on(EventDef.CAMERA_CHANGE, this, this.onCameraChange);
    }

    private removeEvent(): void {
        BIM.ED.off(EventDef.CAMERA_CHANGE, this, this.onCameraChange);
    }

    onCameraChange(change: boolean): void {
        console.log('camera change:', change);
        if (this._posTips) {
            this._posTips.visible = change;
        }
        if(this._controls && this._controls.target) {
            let pos = this._controls.target;
            this._posTips.position.set(pos.x, pos.y, pos.z);
        }
    }


    /** 创建位置指示 */
    private createCenterPoint(): void {
        let right = require('@/assets/img/list.png');
        const map = new TextureLoader().load( right);
        const material = new SpriteMaterial( { 
            map: map,
            sizeAttenuation:false,
            transparent: true,
            depthTest: false,
        } );
        
        this._posTips = new Sprite( material );
        this._posTips.scale.set(0.05, 0.05, 0.05);
        this._scene.add(this._posTips);
        this._posTips.visible = false;
    }

    /**
     * 切换场景相机
     * @param mode 0 透视 否则 正交
     */
    changeCamera(mode: number): void {
        console.log('aerial scene change camera');

        let pos: Vector3 = this._camera.position.clone();
        this._camera = mode == 0 ? this._pcamera : this._ocamera;
        this._camera.position.set(pos.x, pos.y, pos.z);
        this._controls.camera = this._camera;
        this._camera.updateProjectionMatrix();
    }

    private createScene(): void {
        this._scene = new Scene();
        this._scene.fog = new FogExp2(0xcccccc, 0.002);
    }

    /** 创建透视相机 */
    private createPCamera(): void {
        // 透视
        this._pcamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._pcamera.position.set(-10, 10, 10);
        this._pcamera.lookAt(new Vector3(0, 1.5, 0));
        this._camera = this._pcamera;
    }

    /** 创建正交相机 */
    private createOCamera(): void {
        // 正交
        let aspect = this._viewWidth / this._viewHeight;
        this._ocamera = new OrthographicCamera(this.frustumSize * aspect / - 2, this.frustumSize * aspect / 2,
            this.frustumSize / 2, this.frustumSize / - 2, 0.1, 100000);
        this._ocamera.position.set(-10, 10, 10);
        this._ocamera.lookAt(this._scene.position);
        this._scene.add(this._ocamera);
    }

    /** 添加控制器 */
    private createControls(): void {
        this._controls = new OrthCameraCtrl(this._camera, this.render.domElement);
    }

    private createPlane(): void {
        let planeBufferGeomery = new PlaneBufferGeometry(ConstDef.PLANE_WIDTH, ConstDef.PLANE_HEIGTH);
        this._plane = new Mesh(planeBufferGeomery, new MeshPhongMaterial({
            color: 0xcccccc,
            depthWrite: false, // 是否禁用深度写入 
            // side: DoubleSide
        }));
        this._plane.rotation.x = -Math.PI / 2;
        this._plane.receiveShadow = true; // 是否接收阴影
        this._scene.add(this._plane);
    }
    /** 创建辅助坐标系 */
    private createAxis(): void {
        this._axisHelper = new AxesHelper(10);
        this._axisHelper.position.set(0, 0.01, 0);
        this._scene.add(this._axisHelper);
    }
    /** 辅助网格 */
    private createGrid(): void {
        this._grid = new GridHelper(ConstDef.PLANE_WIDTH, ConstDef.PLANE_HEIGTH, 0xcccccc, 0xcccccc);
        this._scene.add(this._grid);
    }
    /** 添加光 */
    private createLight(): void {
        // 环境光，全局光照
        this._ambLight = new AmbientLight(0x666666);
        this._scene.add(this._ambLight);

        // 添加平行光,用来模拟太阳光
        let dirLight = new DirectionalLight(0xeeeeee);
        dirLight.position.set(-10, 100, 100);
        this._scene.add(dirLight);

        // 添加一个半球光
        //  let hemiLight = new HemisphereLight( 0xffffff, 0x444444 );
        //  hemiLight.position.set( 0, 20, 0 );
        //  this._scene.add( hemiLight );
    }

    private createRender(): void {
        this._render = new WebGLRenderer({
            precision: "highp", // 着色器精度:高
            antialias: true, // 锯齿
            alpha: true, // canvas是否包含alpha (透明度)
            logarithmicDepthBuffer: true, //是否使用对数深度缓存
            // preserveDrawingBuffer: true //是否保存绘图缓冲
        });
        // 设置尺寸
        this._render.setSize(window.innerWidth, window.innerHeight);
        // 设置设备的物理像素比
        this._render.setPixelRatio(window.devicePixelRatio);
        // 是否渲染阴影
        this._render.shadowMap.enabled = true;
        this._render.outputEncoding = sRGBEncoding;
    }

    onResize(): void {
        if (BIM.viewmode != 2) {
            this._viewWidth = window.innerWidth;
            this._viewHeight = window.innerHeight;
        }
        // 渲染
        this._render.setSize(this._viewWidth, this._viewHeight);
        // 透视相机
        if (this.camera instanceof PerspectiveCamera) {
            this._camera.aspect = this._viewWidth / this._viewHeight;
            this.camera.updateProjectionMatrix();
        }
        else if (this.camera instanceof OrthographicCamera) {
            // 正交相机
            let aspect = this._viewWidth / this._viewHeight;
            this._camera.left = - this.frustumSize * aspect / 2;
            this._camera.right = this.frustumSize * aspect / 2;
            this._camera.top = this.frustumSize / 2;
            this._camera.bottom = - this.frustumSize / 2;
            this._camera.updateProjectionMatrix();
        }
    }

    dispose(): void {

    }
}