
import ConstDef from "@/libs/ConstDef";
import { Camera, OrthographicCamera, PerspectiveCamera, Scene, sRGBEncoding, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import OrthCameraCtrl from "../controller/OrthCameraCtrl";
import BIM from "../../BIM";
import SceneMgr from "./SceneMgr";
import LockCameraCtrl from "../controller/LockCameraCtrl";
import { Tween, update } from "@tweenjs/tween.js";
import CameraTween from "../controller/CameraTween";
import MeshControlsMgr from "./MeshControlsMgr";

/*
 * @Description: 渲染管理器
 * @Author: songmy
 * @Date: 2022-01-04 18:35:01
 * @LastEditTime: 2022-01-05 12:26:10
 * @LastEditors: 名字
 */
export default class RenderMgr implements IMgr {
    /** 自定义动画时间差：降帧用 */
    private readonly TIME_DIFF: number = 60;
    /** 上次时间 */
    private _lastTime: number;
    /** 当前时间 */
    private _nowTime: number;
    /** 3D场景的引用 */
    private _scene3d: Scene;
    
    /** 屏幕视图 */
    private _scene2d: Scene;
    /** 指示器 */
    private _sceneIdc: Scene;
    /** 透视相机 */
    private _perCamera: any;
    /** 正交相机 */
    private _ortCamera: OrthographicCamera;
    /** 正交相机 */
    private _idcCamera: OrthographicCamera;
    /** webglrender */
    private _render3d: WebGLRenderer;
    /** webglrender */
    private _render2d: WebGLRenderer;
    /** webglrender */
    private _renderIdc: WebGLRenderer;
    /** 鸟瞰控制器 */
    private _aerialControls: OrthCameraCtrl;
    /** 正交控制器 */
    private _hudControls: LockCameraCtrl;
    
    public idcEnable:boolean = false;
    
    public hudEnable:boolean = false;
    
    public arlEnable:boolean = false;

    constructor() {
        console.log('render init')
    }

    startUp(): void {
        console.log('render startup')
        // 渲染功能逻辑
        BIM.viewmode = 0; // 默认3D鸟瞰模式
        // 时间
        this._nowTime = 0;
        this._lastTime = Date.now();
    }

    /** 创建3D场景视图 */
    create3DView(): void {
        // 获取下场景和摄像机的引用，备用
        let mgr = BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr;
       
        mgr.createAerialScene();
        this._scene3d = mgr.aerial.scene;
        this._perCamera = mgr.aerial.camera;
        this._perCamera.lookAt(this._scene3d.position);
        this._render3d = mgr.aerial.render;
        BIM.container.appendChild(this._render3d.domElement);
        // 添加鸟瞰/漫游控制器
        this._aerialControls = mgr.aerial.controls;
        mgr.createBGScene();
        this.arlEnable = true;
    }
    /** 创建2D正交场景视图 */
    create2DView(): void {
        // 获取下场景和摄像机的引用，备用
        let mgr = BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr;
        mgr.createHudScene();
        // this._scene2d = mgr.hud.scene;
        this._ortCamera = mgr.hud.camera;
        // this._ortCamera.lookAt(this._scene2d.position);
        this._render2d = mgr.hud.render;
        BIM.hud.appendChild(this._render2d.domElement);
        // 添加正交控制器
        this._hudControls = mgr.hud.controls;
        this.hudEnable = true;
    }
    /** 创建指示器视图 */
    createIndicatorView(): void {
        // 获取下场景和摄像机的引用，备用
        let mgr = BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr;
        mgr.createIndicatorScene();
        this._sceneIdc = mgr.indicator.scene;
        this._idcCamera = mgr.indicator.camera;
        this._idcCamera.lookAt(this._sceneIdc.position);
        this._renderIdc = mgr.indicator.render;
        BIM.indicator.appendChild(this._renderIdc.domElement);
        this.idcEnable = true;
    }

    changeViewMode(): void {

        let mgr = BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr;
        mgr.indicator.scene.visible = BIM.viewmode == 0;

        if (BIM.viewmode == 0) {
            // 鸟瞰
            console.log('change aerial scene')
            this.changeRender();
            this.changeMode(0);
            
        }
        else if (BIM.viewmode == 1) {
            // 漫游
            console.log('change hud scene')
            this.changeMode(1);

        }
        else if (BIM.viewmode == 2) {
            // 正交
            console.log('change indicator scene');
            this.changeMode(0);
            this.changeRender();
            
        }
        else {
            console.error("切换视图模式时，出现了未定义的模式-viewmode:", BIM.viewmode)
        }
        (BIM.mgr[ConstDef.MESH_CONTROL_MGR] as MeshControlsMgr).changeSceneControl(0);
    }

    changeMode(mode:number):void {
        if(mode == 0){
            this._aerialControls.isLocked = false;
            this._aerialControls.camera.position.set(-10, 10, 10);
            this._aerialControls.camera.lookAt(0, 1.5, 0);
        }
        else if(mode == 1){
            this._aerialControls.isLocked = true;
            this._aerialControls.camera.position.set(-5, 1.5, 5);
            this._aerialControls.camera.lookAt(0, 1.5, 5);
        }
    }

    changeRender(): void {

        let hubW: number = BIM.viewmode == 2 ? 240 : window.innerWidth;
        let hubH: number = BIM.viewmode == 2 ? 240 : window.innerHeight;
        let aerialW: number = BIM.viewmode == 2 ? window.innerWidth : 240;
        let aerialH: number = BIM.viewmode == 2 ? window.innerHeight : 240;
        // 根节点注入
        let mgr = BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr;

        // 主视图
        mgr.hud.render.setViewport(0, 0, aerialW, aerialH);
        mgr.hud.viewWidth = aerialW;
        mgr.hud.viewHeight = aerialH;
        mgr.hud.onResize();
      
        BIM.viewmode == 2 ? BIM.container.appendChild(this._render2d.domElement):
        BIM.hud.appendChild(this._render2d.domElement);

        // 改变视口大小
        mgr.aerial.render.setViewport(0, 0, hubW, hubH);
        mgr.aerial.viewWidth = hubW;
        mgr.aerial.viewHeight = hubH;
        mgr.aerial.onResize();
       
        BIM.viewmode == 2 ? BIM.hud.appendChild(this._render3d.domElement) : 
        BIM.container.appendChild(this._render3d.domElement);
    }

    render(): void {
        //记录当前时间
        this._nowTime = Date.now()
        // 当前时间-上次执行时间如果大于diffTime，那么执行动画，并更新上次执行时间
        if (this._nowTime - this._lastTime > this.TIME_DIFF) {
            this._lastTime = this._nowTime;
            this.excuteRender();
        }
    }

    /** 真正的渲染 */
    excuteRender(): void {

        let mgr = BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr;
        this._perCamera = mgr.aerial.camera; // 重新获取一次，可能会切相机
        // 渲染3D 透视视图
        if (this.arlEnable) {
            // 背景摄像机同步3D相机
            // mgr.bg.camera.position.copy(this._perCamera.position.clone())
            // mgr.bg.camera.updateProjectionMatrix();
            // mgr.bg.camera.lookAt(this._scene3d.position);
            mgr.bg.camera.quaternion.copy(this._perCamera.quaternion.clone());
            this._render3d.render(mgr.bg.scene, mgr.bg.camera);
            // 不自动清理
            this._render3d.autoClear = false;
            // 渲染3D视图
            this._render3d.render(this._scene3d, this._perCamera);
            // 渲染指示器
            if (this.idcEnable) {
                mgr.indicator.renderView()
                let temp = this._perCamera.position.clone();
                this._idcCamera.position.copy(temp.sub(mgr.aerial.controls.target));
                this._idcCamera.updateProjectionMatrix();
                this._idcCamera.lookAt(this._scene3d.position);
    
                this._renderIdc.render(this._sceneIdc, this._idcCamera);
            }
        }
        // 渲染2D 正交视图
        if (this.hudEnable) {
            this._render2d.render(this._scene3d, this._ortCamera);
        }

        // 防止 TWEEN.js未加载完成导致报错
        try {
            update(undefined);
        }
        catch (error) {
            console.log("Tween.js update error!")
        }

        // 其他操作
        // this._controls.update();
        // TestMod.ins.renderControl();
    }

    dispose(): void {

    }
}