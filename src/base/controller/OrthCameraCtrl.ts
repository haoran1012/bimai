import BIM from "@/BIM";
import { Keyboard } from "@/framework/events/Keyboard";
import { Mouse } from "@/framework/utils/Mouse";
import ConstDef from "@/libs/ConstDef";
import EventDef from "@/libs/EventDef";
import { Euler, EventDispatcher, MOUSE, OrthographicCamera, PerspectiveCamera, Quaternion, Spherical, Vector2, Vector3 } from "three";
import MeshControlsMgr from "../manager/MeshControlsMgr";

const _changeEvent = {
    type: 'change'
};
const _startEvent = {
    type: 'start'
};
const _endEvent = {
    type: 'end'
};

const STATE = {
    NONE: - 1,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_PAN: 4,
    TOUCH_DOLLY_PAN: 5,
    TOUCH_DOLLY_ROTATE: 6
};
let rotateurl = require('@/assets/img/mouse/rotate.png');
let transurl = require('@/assets/img/mouse/trans.png');
let scaleurl = require('@/assets/img/mouse/scale.png');
/**
 * @description 摄像机控制类，
 * @author songmy
 */
export default class OrthCameraCtrl extends EventDispatcher implements IDispose {

    protected readonly EPS = 0.000001;

    protected _camera: any;

    protected _domElement: HTMLElement;

    protected _enabled: boolean;

    protected _pointers: any[];

    protected _pointerPositions = {};

    protected _state: number;

    protected _rotateStart: Vector2;

    protected _rotateEnd: Vector2;

    protected _rotateDelta: Vector2;

    protected _panStart: Vector2;

    protected _panEnd: Vector2;

    protected _panDelta: Vector2;

    protected _dollyStart: Vector2;

    protected _dollyEnd: Vector2;

    protected _dollyDelta: Vector2;

    protected _scale: number;

    protected _enableZoom: boolean;

    protected _minZoom: number;

    protected _maxZoom: number;

    protected _zoomChanged: boolean;

    protected _zoomSpeed: number;

    protected _rotateSpeed: number;

    protected _panSpeed: number;
    /** 球坐标中的当前位置 */
    protected _spherical: Spherical;

    protected _sphericalDelta: Spherical;

    protected _enablePan: boolean;

    protected _target: Vector3;

    protected _panOffset: Vector3;

    protected _screenSpacePanning: boolean;
    /** 是否启用阻尼（惯性），如果该值被启用，你将必须在你的循环里调用.update()*/
    protected _enableDamping: boolean;

    protected _dampingFactor: number;
    /** 水平环绕的距离，上限和下限。如果设置，间隔[min，max]必须是[-2pi，2pi]的子间隔，且（max-min<2pi） */
    protected _minAzimuthAngle: number;

    protected _maxAzimuthAngle: number;

    protected _minPolarAngle: number;

    protected _maxPolarAngle: number;

    protected _minDistance: number;

    protected _maxDistance: number;
    /** 按键移动的像素 */
    protected _keyPanSpeed: number;

    protected _isLocked:boolean;

    protected _euler:Euler;

    protected mouseButtons = {
        LEFT: MOUSE.ROTATE,
        MIDDLE: MOUSE.DOLLY,
        RIGHT: MOUSE.PAN
    }

    constructor(camera: any, document: HTMLElement) {
        super();
        console.log('create orthcameractrl')
        this._camera = camera;
        this._domElement = document;
        this._enabled = true;
        this._pointers = [];
        this._state = STATE.NONE;
        this._scale = 1;
        this._enableZoom = true;
        this._enablePan = true;
        this._zoomChanged = false;
        this._minZoom = 0;
        this._maxZoom = Infinity;
        this._zoomSpeed = 1.0;
        this._rotateSpeed = 1.0;
        this._panSpeed = 1.0;
        this._minPolarAngle = 0;
        this._maxPolarAngle = Math.PI;
        this._minDistance = 5;
        this._maxDistance = 500;
        this._rotateStart = new Vector2();
        this._rotateEnd = new Vector2();
        this._rotateDelta = new Vector2();
        this._panStart = new Vector2();
        this._panEnd = new Vector2();
        this._panDelta = new Vector2();
        this._dollyStart = new Vector2();
        this._dollyEnd = new Vector2();
        this._dollyDelta = new Vector2();
        this._target = new Vector3();
        this._panOffset = new Vector3();
        this._spherical = new Spherical();
        this._sphericalDelta = new Spherical();
        this._screenSpacePanning = true;
        this._enableDamping = false;
        this._dampingFactor = 0.05;
        this._keyPanSpeed = 7.0;
        this._minAzimuthAngle = -Infinity;
        this._maxAzimuthAngle = Infinity;
        this._isLocked = false;
        this._euler = new Euler(0, 0, 0 ,'YXZ');
        
        this.addEveListener();
        this.update();
    }

    protected addEveListener(): void {
        console.log('orthcameractrl add listener')
        this._domElement.addEventListener('contextmenu', (event) => {
            this.onContextMenu(event);
        });
        this._domElement.addEventListener('pointerdown', (event) => {
            this.onPointerDown(event);
        });
        this._domElement.addEventListener('pointercancel', (event) => {
            this.onPointerCancel(event);
        });
        this._domElement.addEventListener('wheel', (event) => {
            this.onMouseWheel(event);
        },{
            passive: false
        });
        document.addEventListener('keydown', (event) => {
            this.onKeyDown(event);
        });
    }

    protected onContextMenu(event: any): void {
        if (this._enabled === false) return;
        event.preventDefault();
    }

    protected onPointerDown(event: any): void {
        if (this._enabled === false) return;
        if (this._pointers.length === 0) {
            this._domElement.setPointerCapture(event.pointerId);
            this._domElement.addEventListener('pointermove', (event) => {
                this.onPointerMove(event)
            });
            this._domElement.addEventListener('pointerup', (event) => {
                this.onPointerUp(event)
            });
        }

        this.addPointer(event);

        if (event.pointerType === 'touch') {

            // this.onTouchStart( event );

        } else {

            this.onMouseDown(event);

        }
    }

    protected addPointer(event: any): void {
        this._pointers.push(event);
    }

    protected removePointer(event: any): void {
        delete this._pointerPositions[event.pointerId];
        for (let i = 0; i < this._pointers.length; i++) {
            if (this._pointers[i].pointerId == event.pointerId) {
                this._pointers.splice(i, 1);
                return;
            }
        }
    }

    protected onPointerCancel(event: any): void {
        this.removePointer(event);
        
    }

    protected onMouseWheel(event: any): void {
        // console.log("whle")
        if (this._enabled === false || this._state != STATE.NONE) return;
        // Mouse.cursor = 'all-scroll'
        event.preventDefault();
        this.dispatchEvent(_startEvent);
        this.handleMouseWheel(event);
        this.dispatchEvent(_endEvent);
        
    }

    protected onPointerMove(event: any): void {
        if (this._enabled === false) return;
        if (event.pointerType === 'touch') {

        }
        else {
            this.onMouseMove(event);
        }
    }

    protected onPointerUp(event: any): void {
        Mouse.cursor = 'auto'
        this.removePointer(event);
        if (this._pointers.length === 0) {
            this._domElement.releasePointerCapture(event.pointerId);
            this._domElement.removeEventListener('pointermove', (event) => {
                this.onPointerMove(event);
            });
            this._domElement.removeEventListener('pointerup', (event) => {
                this.onPointerUp(event);
            });
        }

        this.dispatchEvent(_endEvent);
        this._state = STATE.NONE;
        BIM.ED.event(EventDef.CAMERA_CHANGE, false);
    }

    protected onMouseDown(event: any): void {

        let mouseAction = event.button == 0 ? this.mouseButtons.LEFT :
            event.button == 1 ? this.mouseButtons.MIDDLE :
                event.button == 2 ? this.mouseButtons.RIGHT : -1;
        // console.log("pointer:", mouseAction)
        switch (mouseAction) {
            case MOUSE.DOLLY:
                
                // this.handleMouseDownDolly(event);
                // this._state = STATE.DOLLY;
                Mouse.cursor  = "url("+ transurl + "), auto";
                this.handleMouseDownPan(event);
                this._state = STATE.PAN;
                break;
            case MOUSE.ROTATE:
                Mouse.cursor  = "url("+ rotateurl + "), auto";
                this.handleMouseDownRotate(event);
                this._state = STATE.ROTATE;
                break;
            case MOUSE.PAN:
                Mouse.cursor  = "url("+ transurl + "), auto";
                this.handleMouseDownPan(event);
                this._state = STATE.PAN;
                break;
            default:
                this._state = STATE.NONE;
                break;
        }
        if (this._state != STATE.NONE) {
            this.dispatchEvent(_startEvent);
        }
    }

    protected onMouseMove(event: any): void {
        if (this._enabled === false) return;
        switch (this._state) {
            case STATE.ROTATE:

                this.handleMouseMoveRotate(event);
                break;
            case STATE.DOLLY:
                this.handleMouseMoveDolly(event);
                break;
            case STATE.PAN:
                this.handleMouseMovePan(event);
                break;
        }
    }
    
    /** 按下滚轮移动缩放 */
    protected handleMouseDownDolly(event: any): void {
        this._dollyStart.set(event.clientX, event.clientY);
    }

    protected handleMouseDownRotate(event: any): void {
        this._rotateStart.set(event.clientX, event.clientY);
    }

    protected handleMouseDownPan(event: any): void {
        this._panStart.set(event.clientX, event.clientY);
    }

    protected handleMouseMoveRotate(event: any): void {
        BIM.ED.event(EventDef.CAMERA_CHANGE, true);
        this._rotateEnd.set(event.clientX, event.clientY);
        this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this._rotateSpeed);
        this.rotateLeft(2 * Math.PI * this._rotateDelta.x / this._domElement.clientHeight);
        this.rotateUp(2 * Math.PI * this._rotateDelta.y / this._domElement.clientHeight);
        this._rotateStart.copy(this._rotateEnd);
        this.update();
    }

    /** 左右旋转 */
    protected rotateLeft(angle: number): void {
        this._sphericalDelta.theta -= angle;
    }

    /** 上下旋转 */
    protected rotateUp(angle: number): void {
        this._sphericalDelta.phi -= angle;
        // console.log("sss", this._sphericalDelta.phi)
    }

    /** 左右移动 */
    protected panLeft(distance: number, objectMatrix: any): void {
        let v = new Vector3();
        v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix

        v.multiplyScalar(- distance);
        this._panOffset.add(v);
    }

    /** 上下移动 */
    protected panUp(distance: number, objectMatrix: any): void {
        let v = new Vector3();
        if (this._screenSpacePanning === true) {
            v.setFromMatrixColumn(objectMatrix, 1);
        }
        else {
            v.setFromMatrixColumn(objectMatrix, 0);
            v.crossVectors(this._camera.up, v);
        }

        v.multiplyScalar(distance);
        this._panOffset.add(v);
    }

    /** 前后移动 */
    protected panForward(distance: number, objectMatrix: any):void {
        let v = new Vector3();
        v.setFromMatrixColumn(objectMatrix, 0);
        // 向量叉积
        v.crossVectors( this._camera.up, v ); 
        v.multiplyScalar(- distance);
        this._panOffset.add(v);
    }


    protected handleMouseMoveDolly(event: any): void {

        this._dollyEnd.set(event.clientX, event.clientY);
        this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart);

        if (this._dollyDelta.y > 0) {

            this.dollyOut(this.getZoomScale());

        } else if (this._dollyDelta.y < 0) {

            this.dollyIn(this.getZoomScale());
        }

        this._dollyStart.copy(this._dollyEnd);
        this.update();
    }

    protected pan(deltaX: number, deltaY: number, isForward:boolean = false): void {

        let offset = new Vector3();

        let element = this._domElement;
        if (this._camera instanceof PerspectiveCamera) {
            // 透视相机
            let position = this._camera.position;
            offset.copy(position).sub(this._target);
            let targetDistance = offset.length(); 
            
            targetDistance *= Math.tan(this._camera.fov / 2 * Math.PI / 180.0); 
            
            if(isForward){
                this.panForward(2 * deltaX * targetDistance / element.clientHeight, this._camera.matrix);
            }
            else {
                this.panLeft(2 * deltaX * targetDistance / element.clientHeight, this._camera.matrix);
            }
            if(deltaY != 0){
                this.panUp(2 * deltaY * targetDistance / element.clientHeight, this._camera.matrix);
            }
        }
        else if (this._camera instanceof OrthographicCamera) {

            // 正交相机
            if(isForward){
                this.panForward(deltaX * (this._camera.top - this._camera.bottom) / this._camera.zoom / element.clientWidth, this._camera.matrix);
            }
            else {
                this.panLeft(deltaX * (this._camera.right - this._camera.left) / this._camera.zoom / element.clientWidth, this._camera.matrix);
            }
            // this.panLeft(deltaX * (this._camera.right - this._camera.left) / this._camera.zoom / element.clientWidth, this._camera.matrix);
            // this.panUp(deltaY * (this._camera.top - this._camera.bottom) / this._camera.zoom / element.clientHeight, this._camera.matrix);
        }
        else {

            // 相机类型出错
            console.warn('WARNING: OrthCameraCtrl.ts encountered an unknown camera type - pan disabled.');
            this._enablePan = false;
        }
    }

    protected handleMouseMovePan(event: any): void {
        this._panEnd.set(event.clientX, event.clientY);
        this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this._panSpeed);
        this.pan(this._panDelta.x, 0);
        this.pan(-this._panDelta.y, 0, true);
        this._panStart.copy(this._panEnd);
        this.update();
    }

    protected getZoomScale(): number {
        return Math.pow(0.95, this._zoomSpeed);
    }

    protected handleMouseWheel(event: any): void {

        
        Mouse.cursor  = "url("+ scaleurl + "), auto";
        // //设置相机缩放比数值越大缩放越明显
        // let factor = 1.5;
        // //从鼠标位置转化为webgl屏幕坐标位置
        // let glScreenX = (event.clientX / this._domElement.clientWidth) * 2 - 1;
        // let glScreenY = -(event.clientY / this._domElement.clientWidth) * 2 + 1;
        // let vector = new Vector3(glScreenX, glScreenY, 0);
        // //从屏幕向量转为3d空间向量
        // vector.unproject(this._camera);
        // //相机偏移量
        // vector.sub(this._camera.position).setLength(factor);
        // if (event.deltaY < 0) {
        //     this._camera.position.add(vector);
        //     this.target.add(vector);
        // } else {
        //     this._camera.position.sub( vector);
        //     this.target.sub(vector);
        // }

       
        if (event.deltaY < 0) {

            this.dollyIn(this.getZoomScale());

        } else if (event.deltaY > 0) {

            this.dollyOut(this.getZoomScale());

        }
        this.update();
        BIM.timer.once(100, this, this.resetMouse);
    }

    private resetMouse():void {
        Mouse.cursor  = "auto";
    }

    update(): boolean {

        let offset = new Vector3(); // camera.up 轨道轴 
        let quat = new Quaternion().setFromUnitVectors(this._camera.up, new Vector3(0, 1, 0));
        let quatInverse = quat.clone().invert();
        let lastPosition = new Vector3();
        let lastQuaternion = new Quaternion();
        let twoPI = 2 * Math.PI;

        const position = this._camera.position;
        offset.copy(position).sub(this._target); // 旋转偏移到“y轴向上”空间
        offset.applyQuaternion(quat); // 从z轴到y轴的角度
        this._spherical.setFromVector3(offset);
        if (this._enableDamping) {
            this._spherical.theta += this._sphericalDelta.theta * this._dampingFactor;
            this._spherical.phi += this._sphericalDelta.phi * this._dampingFactor;
        }
        else {
            this._spherical.theta += this._sphericalDelta.theta;
            this._spherical.phi += this._sphericalDelta.phi;
        }
        
        //将θ限制在所需限值之间
        let min = this._minAzimuthAngle;
        let max = this._maxAzimuthAngle;

        if (isFinite(min) && isFinite(max)) {
            if (min < - Math.PI) min += twoPI;
            else if (min > Math.PI) min -= twoPI;
            if (max < - Math.PI) max += twoPI;
            else if (max > Math.PI) max -= twoPI;
            if (min <= max) {
                this._spherical.theta = Math.max(min, Math.min(max, this._spherical.theta));
            }
            else 
            {
                this._spherical.theta = this._spherical.theta > (min + max) / 2 ? Math.max(min, this._spherical.theta) : Math.min(max, this._spherical.theta);
            }
        }

        //将phi限制在所需限值之间
        this._spherical.phi = Math.max(this._minPolarAngle, Math.min(this._maxPolarAngle, this._spherical.phi));
        this._spherical.makeSafe();
        
        //将半径限制在所需限制之间
        this._spherical.radius *= this._scale;
        // console.log("radius:",this._spherical.radius)
        this._spherical.radius = Math.max(this._minDistance, Math.min(this._maxDistance, this._spherical.radius));

        //将目标移动到平移位置
        if (this._enableDamping === true) {
            this._target.addScaledVector(this._panOffset, this._dampingFactor);
        }
        else {
            this._target.add(this._panOffset);
        }
        if(this._isLocked){
            let PI_2:number = Math.PI / 2;
            // 平移
            position.copy(this._target).add(offset); 
            // 旋转
            this._euler.setFromQuaternion( this._camera.quaternion );
            this._euler.y -= this._sphericalDelta.theta * 0.1;
            this._euler.x -= (this._sphericalDelta.phi) * 0.1;
            this._euler.x = Math.max(PI_2 - this._maxPolarAngle, Math.min(PI_2 - this._minPolarAngle, this._euler.x));
            this._camera.quaternion.setFromEuler( this._euler );
        }
        else {
            // 添加左右上下的球形位置
            offset.setFromSpherical(this._spherical);
            offset.applyQuaternion(quatInverse);
            position.copy(this._target).add(offset);
            this._camera.lookAt(this._target);
        }
       
        // 
        if (this._enableDamping === true) {
            this._sphericalDelta.theta *= 1 - this._dampingFactor;
            this._sphericalDelta.phi *= 1 - this._dampingFactor;
            this._panOffset.multiplyScalar(1 - this._dampingFactor);
        }
        else {
            this._sphericalDelta.set(0, 0, 0);
            this._panOffset.set(0, 0, 0);
        }

        this._scale = 1;
        //更新条件为：
        //最小值（摄像机位移，摄像机旋转弧度）^2>EPS
        //使用小角度近似cos（x/2）=1-x^2/8
        if (this._zoomChanged ||
            lastPosition.distanceToSquared(this._camera.position) > this.EPS ||
            8 * (1 - lastQuaternion.dot(this._camera.quaternion)) > this.EPS) {

            this.dispatchEvent(_changeEvent);
            lastPosition.copy(this._camera.position);
            lastQuaternion.copy(this._camera.quaternion);
            this._zoomChanged = false;
            return true;

        }
        return false;
    }

    protected dollyIn(dollyScale: number): void {
        if (this._camera instanceof PerspectiveCamera) {
            this._scale *= dollyScale;
            (BIM.mgr[ConstDef.MESH_CONTROL_MGR] as MeshControlsMgr).changeScaleControl(this._scale);
            // console.log("scale:", this._state)
        }
        else if (this._camera instanceof OrthographicCamera) {
            this._camera.zoom = Math.max(this._minZoom, Math.min(this._maxZoom, this._camera.zoom / dollyScale));
            this._camera.updateProjectionMatrix();
            this._zoomChanged = true;
            (BIM.mgr[ConstDef.MESH_CONTROL_MGR] as MeshControlsMgr).changeScaleControl(this._camera.zoom);
        }
        else {
            console.warn('BIMAI_WARING: OrthCameraCtrl.ts encountered an unknown camera type -function:dollyIn()')
            this._zoomChanged = false;
        }
    }

    protected dollyOut(dollyScale: number): void {
        if (this._camera instanceof PerspectiveCamera) {
            this._scale /= dollyScale;
            (BIM.mgr[ConstDef.MESH_CONTROL_MGR] as MeshControlsMgr).changeScaleControl(this._scale);
            // console.log("scale:", this._state)
        }
        else if (this._camera instanceof OrthographicCamera) {
            this._camera.zoom = Math.max(this._minZoom, Math.min(this._maxZoom, this._camera.zoom * dollyScale));
            this._camera.updateProjectionMatrix();
            this._zoomChanged = true;
            (BIM.mgr[ConstDef.MESH_CONTROL_MGR] as MeshControlsMgr).changeScaleControl(this._camera.zoom);
        }
        else {
            console.warn('BIMAI_WARING: OrthCameraCtrl.ts encountered an unknown camera type -function:dollyOut()')
            this._zoomChanged = false;
        }
    }

    protected onKeyDown(event: any): void {
        if (this._enabled === false) return;
        this.handleKeyDown(event);
    }

    protected handleKeyDown(event: any): void {
        let needsUpdate = false;

        switch (event.keyCode) {

            case Keyboard.UP:
            case Keyboard.W:
                this.pan(-this._keyPanSpeed, 0, true);
                needsUpdate = true;
                break;

            case Keyboard.DOWN:
            case Keyboard.S:
                this.pan(this._keyPanSpeed, 0, true);
                needsUpdate = true;
                break;

            case Keyboard.LEFT:
            case Keyboard.A:
                this.pan(this._keyPanSpeed, 0);
                needsUpdate = true;
                break;

            case Keyboard.RIGHT:
            case Keyboard.D:
                this.pan(- this._keyPanSpeed, 0);
                needsUpdate = true;
                break;
            case Keyboard.Q:
                this.pan(0, this._keyPanSpeed);
                needsUpdate = true;
                break;
            case Keyboard.E:
                this.pan(0, - this._keyPanSpeed);
                needsUpdate = true;
                break;
        }

        if (needsUpdate) {
            //防止浏览器在光标键上滚动
            event.preventDefault();
            this.update();
        }
    }

    dispose(): void {

        this._domElement.removeEventListener('contextmenu', (event) => {this.onContextMenu(event)});
        this._domElement.removeEventListener('pointerdown', (event) => {this.onPointerDown(event)});
        this._domElement.removeEventListener('pointercancel', (event) => {this.onPointerCancel(event)});
        this._domElement.removeEventListener('wheel', (event) => {this.onMouseWheel(event)});
        this._domElement.removeEventListener('pointermove', (event) => {this.onPointerMove(event)});
        this._domElement.removeEventListener('pointerup', (event) => {this.onPointerUp(event)});
        document.removeEventListener('keydown', (event) => {this.onKeyDown(event)});
    }

    get camera(): any {
        return this._camera;
    }

    set camera(camera: any) {
        this._camera = camera;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }

    set isLocked(value:boolean ) {
        this._isLocked = value;
    }

    get isLocked():boolean {
        return this._isLocked;
    }

    get target():Vector3 {
        return this._target;
    }

    set target(vec:Vector3) {
        this._target = vec;
        this.update();
    }
}