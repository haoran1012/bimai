import BIM from "@/BIM";
import ConstDef from "@/libs/ConstDef";
import EventDef from "@/libs/EventDef";
import { Tween } from "@tweenjs/tween.js";
import { AmbientLight, AxesHelper, Color, CubeTextureLoader, DirectionalLight, DoubleSide, EventDispatcher, FogExp2, GridHelper, HemisphereLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneBufferGeometry, Scene, sRGBEncoding, Texture, Vector3 } from "three";
import CameraTween from "../controller/CameraTween";
import AerialScene from "../scene/AerialScene";
import BgScene from "../scene/BgScene";
import HudScene from "../scene/HudScene";
import IndicatorScene from "../scene/IndicatorScene";

export default class SceneMgr implements IMgr {

    /** 鸟瞰场景 */
    private _aerial: AerialScene;
    /** 正交场景 */
    private _hud: HudScene;
    /** 指示器 */
    private _indicator: IndicatorScene;
    /** 背景 */
    private _bg:BgScene;

    private _center:Vector3;

    get aerial(): AerialScene {
        return this._aerial;
    }

    get hud(): HudScene {
        return this._hud;
    }

    get indicator(): IndicatorScene {
        return this._indicator;
    }

    get bg():BgScene {
        return this._bg;
    }

    get center():Vector3 {
        return this._center;
    }

    set center(value:Vector3) {
        this._center = value;
    }

    constructor() {
        this._center = new Vector3(0, 0 ,0);
    }

    startUp(): void {
        console.log('scene manager startup');
        
    }

    createBGScene(): void {
        console.log('create bg scene')
        this._bg = new BgScene();
    }

    createAerialScene(): void {
        console.log('create aerial scene')
        this._aerial = new AerialScene();
    }

    createHudScene(): void {
        console.log('create hub scene')
        this._hud = new HudScene();
    }

    createIndicatorScene(): void {
        console.log('create indicator scene')
        this._indicator = new IndicatorScene();
        this._indicator.addEventListener(EventDef.INDICATOR_POINT_DOWN, (data) => { this.onPointDow(data.faceIndex) })
    }

    onPointDow(data: number): void {
        console.log("点击了面：", data);
        // 右 0 左 1 上 2 下 3 前 4 后 5
        let dis: number = 30;
        let newC: Vector3 = new Vector3();
       
        let newT: Vector3 = new Vector3(this._center.x, this._center.y, this._center.z);
        switch (data) {
            case ConstDef.RIGHT:
                newC.set(dis, 0, 0);
                break;
            case ConstDef.LEFT:
                newC.set(-dis, 0, 0);
                break;
            case ConstDef.TOP:
                newC.set(0, dis, 0);
                break;
            case ConstDef.BOTTOM:
                newC.set(0, -dis, 0);
                break;
            case ConstDef.FRONT:
                newC.set(0, 0, dis);
                break;
            case ConstDef.BACK:
                newC.set(0, 0, -dis);
                break;
            case ConstDef.FRONT_RIGHT_TOP:
                newC.set(dis / 2, dis * Math.sqrt(2), dis / 2);
                break;
            case ConstDef.FRONT_RIGHT_BOTTOM:
                newC.set(dis / 2, -dis * Math.sqrt(2), dis / 2);
                break;
            case ConstDef.FRONT_LEFT_TOP:
                newC.set(-dis / 2, dis * Math.sqrt(2), dis / 2);
                break;
            case ConstDef.FRONT_LEFT_BOTTOM:
                newC.set(-dis / 2, -dis * Math.sqrt(2), dis / 2);
                break;
            case ConstDef.BACK_RIGHT_TOP:
                newC.set(dis / 2, dis * Math.sqrt(2), -dis / 2);
                break;
            case ConstDef.BACK_RIGHT_BOTTOM:
                newC.set(dis / 2, -dis * Math.sqrt(2), -dis / 2);
                break;
            case ConstDef.BACK_LEFT_TOP:
                newC.set(-dis / 2, dis * Math.sqrt(2), -dis / 2);
                break;
            case ConstDef.BACK_LFET_BORROM:
                newC.set(-dis / 2, -dis * Math.sqrt(2), -dis / 2);
                break;
            case ConstDef.EDGE_TOP_FRONE:
                newC.set(0, dis / 2 * Math.sqrt(2), dis / 2 * Math.sqrt(2));
                break;
            case ConstDef.EDGE_TOP_RIGHT:
                newC.set(dis / 2 * Math.sqrt(2), dis / 2 * Math.sqrt(2), 0);
                break;
            case ConstDef.EDGE_TOP_BACK:
                newC.set(0, dis / 2 * Math.sqrt(2), -dis / 2 * Math.sqrt(2));
                break;
            case ConstDef.EDGE_TOP_LEFT:
                newC.set(dis / 2 * Math.sqrt(2), dis / 2 * Math.sqrt(2), 0);
                break;
            case ConstDef.EDGE_MF_LEFT:
                newC.set(-dis / 2 * Math.sqrt(2), 0, dis / 2 * Math.sqrt(2));
                break;
            case ConstDef.EDGE_MF_RIGHT:
                newC.set(dis / 2 * Math.sqrt(2), 0, dis / 2 * Math.sqrt(2));
                break;
            case ConstDef.EDGE_MB_RIGHT:
                newC.set(dis / 2 * Math.sqrt(2), 0, -dis / 2 * Math.sqrt(2));
                break;
            case ConstDef.EDGE_MB_LEFT:
                newC.set(-dis / 2 * Math.sqrt(2), 0, -dis / 2 * Math.sqrt(2));
                break;
            case ConstDef.EDGE_BOTTOM_FRONE:
                newC.set(0, -dis / 2 * Math.sqrt(2), dis / 2 * Math.sqrt(2));
                break;
            case ConstDef.EDGE_BOTTOM_RIGHT:
                newC.set(dis / 2 * Math.sqrt(2), -dis / 2 * Math.sqrt(2), 0);
                break;
            case ConstDef.EDGE_BOTTOM_BACK:
                newC.set(0, -dis / 2 * Math.sqrt(2), -dis / 2 * Math.sqrt(2));
                break;
            case ConstDef.EDGE_BOTTOM_LEFT:
                newC.set(-dis / 2 * Math.sqrt(2), -dis / 2 * Math.sqrt(2), 0);
                break;
            default:
                console.error("出现了位置的视角位置")
                break
        }
        console.log("center:", this._center)
        let cc = new Vector3(this._center.x, this._center.y, this._center.z);
        newC.add(cc);
        this.showTween(newC, newT, 500, this.complate);
    }

    complate(): void {
        let mgr = BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr;
        console.log("camera:", mgr.aerial.camera.position);
        console.log("target", mgr.aerial.controls.target)
    }

    showTween(newC: Vector3, newT: Vector3, time: number = 1000, callBack?: Function): void {
        //    console.log("sdd:", newC.x, newC.y, newC.z)
        CameraTween.animateCamera(this._aerial.camera, this._aerial.controls, this._aerial.camera.position,
            this._aerial.controls.target, newC, newT, time, callBack)

        // Tween.get(target).to({alpha:1}, 1000).call(handleComplete);
    }

    onResize(): void {
        if (this._aerial) {
            this._aerial.onResize();
        }
        if (this._hud) {
            this._hud.onResize();
        }
        if(this._bg){
            this._bg.onResize();
        }
    }

    dispose(): void {
        this._aerial.dispose();
        this._aerial = null;
        this._hud.dispose();
        this._hud = null;
    }
}