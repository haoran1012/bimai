import BIM from "@/BIM";
import ConstDef from "@/libs/ConstDef";
import { AmbientLight, DoubleSide, GridHelper, Mesh, MeshPhongMaterial, OrthographicCamera, PlaneBufferGeometry, Scene, sRGBEncoding, WebGLRenderer } from "three";
import LockCameraCtrl from "../controller/LockCameraCtrl";

/**
 * @description 2D正交场景
 * @author songmy
 */
export default class HudScene implements IDispose {

    private readonly frustumSize: number = 10;
    /** 场景 */
    private _scene: Scene;
    /** 平面 */
    private _plane: Mesh;
    /** 辅助网格 */
    private _grid: GridHelper;
    /** 环境光 */
    private _ambLight: AmbientLight;
    /** 摄像机:正交 */
    private _camera: OrthographicCamera;
    /** 渲染 */
    private _render: WebGLRenderer;
    /** 视口宽 */
    private _viewWidth: number;
    /** 视口高 */
    private _viewHeight: number;
    /** 控制器 */
    private _controls: LockCameraCtrl;

    get controls(): LockCameraCtrl {
        return this._controls;
    }

    get camera(): OrthographicCamera {
        return this._camera;
    }

    get render(): WebGLRenderer {
        return this._render;
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

    constructor() {

        this._viewWidth = 240;
        this._viewHeight = 240;
        // this.createScene();
        this.createCamera();
        // this.createPlane();
        // this.createAxis();
        // this.createLight();
        this.createRender();
        this.createControls();
    }

    private createScene(): void {
        this._scene = new Scene();
    }

    private createCamera(): void {
        let aspect = this._viewWidth / this._viewHeight;
        this._camera = new OrthographicCamera(this.frustumSize * aspect / - 2, this.frustumSize * aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, 0.1, 1000);
        this._camera.position.set(0, 100, 0);
    }

    private createPlane(): void {
        let planeBufferGeomery = new PlaneBufferGeometry(ConstDef.PLANE_WIDTH, ConstDef.PLANE_HEIGTH);
        this._plane = new Mesh(planeBufferGeomery, new MeshPhongMaterial({
            color: 0xcccccc,
            depthWrite: false, // 是否禁用深度写入 
            side:DoubleSide
        }));
        this._plane.rotation.x = -Math.PI / 2;
        this._scene.add(this._plane);
    }

    private createAxis(): void {
        this._grid = new GridHelper(ConstDef.PLANE_WIDTH, ConstDef.PLANE_HEIGTH, 0xaaaaaa, 0xaaaaaa);
        this._scene.add(this._grid);
    }

    private createLight(): void {
        this._ambLight = new AmbientLight(0xeeeeee); // soft white light
        this._scene.add(this._ambLight);
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
        this._render.setSize(this._viewWidth, this._viewHeight);
        // 设置设备的物理像素比
        this._render.setPixelRatio(window.devicePixelRatio);
        // 是否渲染阴影
        this._render.shadowMap.enabled = true;
        this._render.outputEncoding = sRGBEncoding;
    }

    /** 添加控制器 */
    private createControls(): void {
        this._controls = new LockCameraCtrl(this._camera, this.render.domElement);
    }

    onResize(): void {
        if (BIM.viewmode == 2) {
            this._viewWidth = window.innerWidth;
            this._viewHeight = window.innerHeight;
        }
        // 渲染
        this._render.setSize(this._viewWidth, this._viewHeight);
        // 正交相机
        let aspect = this._viewWidth / this._viewHeight;
        this._camera.left = - this.frustumSize * aspect / 2;
        this._camera.right = this.frustumSize * aspect / 2;
        this._camera.top = this.frustumSize / 2;
        this._camera.bottom = - this.frustumSize / 2;
        this._camera.updateProjectionMatrix();
    }


    dispose(): void {

    }
}