import BIM from "@/BIM";
import ConstDef from "@/libs/ConstDef";
import { Color, CubeTextureLoader, PerspectiveCamera, Scene, sRGBEncoding, Texture, Vector3 } from "three";
/**
 * @description 背景视图，主要用于渲染背景颜色/天空盒
 * @author songmy
 */
export default class BgScene implements IDispose {
    /** 场景 */
    private _scene: Scene;
    /** 摄像机:透视 */
    private _pcamera: PerspectiveCamera;
    /** 视口宽 */
    private _viewWidth: number;
    /** 视口高 */
    private _viewHeight: number;
    /** 环境贴图 */
    private _textureCube: Texture;
    /** 背景颜色 */
    private _bgcolor: Color;

    get scene(): Scene {
        return this._scene;
    }

    get camera(): PerspectiveCamera {
        return this._pcamera;
    }

    constructor() {
        this._viewWidth = window.innerWidth;
        this._viewHeight = window.innerHeight;

        this.createScene();
        this.createCamera();
        this.changeBackground(3);
    }

    private createScene(): void {
        this._scene = new Scene();
        this._scene.background = new Color(ConstDef.COLOR_DIMGRAY);
    }

    private createCamera(): void {
        // 透视
        this._pcamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._pcamera.position.set(-10, 10, 10);
        this._pcamera.lookAt(this._scene.position);
    }

    /** 改变背景 */
    changeBackground(mode: number): void {

        if (!this._bgcolor) {
            this._bgcolor = new Color();
        }
        let color = mode == 1 ? 0xcccccc : mode == 2 ? 0x464547 : mode == 3 ? 0xcccccc : 0xcccccc;
        if (mode == 3) {
            if (!this._textureCube) {
                this.loadBackgroundTexture();
            }
            this._scene.background = this._textureCube;
        }
        else {
            if (this._scene.background instanceof Texture) {
                this._scene.background.dispose();
            }

            this._bgcolor.set(color)
            this._scene.background = this._bgcolor;
        }
    }

    /** 加载背景 */
    private loadBackgroundTexture(): void {

        let right = require('@/assets/img/EnvMap_right.jpg');
        let left = require('@/assets/img/EnvMap_left.jpg');
        let top = require('@/assets/img/EnvMap_top.jpg');
        let bottom = require('@/assets/img/EnvMap_bottom.jpg');
        let front = require('@/assets/img/EnvMap_front.jpg');
        let back = require('@/assets/img/EnvMap_back.jpg');

        //注意加载的图片是有顺序的，分别是：右 => 左 => 上 => 下 => 前 => 后 六张宽高、格式相同的图片
        //我们可以想象一下一个正方体盒子，而我们的模型就位于正方体盒子内部一样。
        var urls = [right, left, top, bottom, front, back];
        this._textureCube = new CubeTextureLoader().load(urls);
        this._textureCube.encoding = sRGBEncoding;
    }

    onResize(): void {
        if (BIM.viewmode != 2) {
            this._viewWidth = window.innerWidth;
            this._viewHeight = window.innerHeight;
        }
        // 渲染
        // 透视相机
        this._pcamera.aspect = this._viewWidth / this._viewHeight;
        this.camera.updateProjectionMatrix();
    }


    dispose(): void {

    }
}