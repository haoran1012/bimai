import ConstDef from "@/libs/ConstDef";
import { AmbientLight, BoxBufferGeometry, BoxGeometry, BufferAttribute, BufferGeometry, Color, CubeTextureLoader, DirectionalLight, DoubleSide, EdgesGeometry, EventDispatcher, GridHelper, ImageLoader, Line, LineBasicMaterial, LineLoop, LineSegments, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, OrthographicCamera, PlaneBufferGeometry, Raycaster, Scene, SphereGeometry, sRGBEncoding, Texture, TextureLoader, Vec2, Vector2, Vector3, WebGLRenderer } from "three";
import earcut from 'earcut';
import BIM from "@/BIM";
import EventDef from "@/libs/EventDef";
import CSG from "@/framework/csg/CSG";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Line2 } from "three/examples/jsm/lines/Line2";
/**
 * @description 指示器
 * @author songmy
 */
export default class IndicatorScene extends EventDispatcher implements IDispose {

    private readonly frustumSize: number = 10;
    /** 场景 */
    private _scene: Scene;
    /** 摄像机:正交 */
    private _camera: OrthographicCamera;
    /** 渲染 */
    private _render: WebGLRenderer;
    /** 视口宽 */
    private _viewWidth: number;
    /** 视口高 */
    private _viewHeight: number;
    /** 贴图 */
    private _textureCube: Texture;

    private _pointer: Vector2;

    private _raycaster: Raycaster;

    private INTERSECTED: any;


    get scene(): Scene {
        return this._scene;
    }

    get camera(): OrthographicCamera {
        return this._camera;
    }


    get render(): WebGLRenderer {
        return this._render;
    }

    get pointer(): Vector2 {
        return this._pointer;
    }

    constructor() {
        super();
        this._viewWidth = 120;
        this._viewHeight = 120;

        this.createScene();
        this.createCamera();
        this.createLight();
        this.createBox();
        this.createRender();

    }

    private createScene(): void {
        this._scene = new Scene();
    }

    private createCamera(): void {
        let aspect = this._viewWidth / this._viewHeight;
        this._camera = new OrthographicCamera(this.frustumSize * aspect / - 2, this.frustumSize * aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, 0.1, 1000);
        // this._camera.position.set(0, 0, 10);
    }

    /** 添加光 */
    private createLight(): void {
        // 环境光，全局光照
        let ambLight = new AmbientLight(ConstDef.COLOR_DIMGRAY);
        this._scene.add(ambLight);

        // 添加平行光,用来模拟太阳光
        let dirLight = new DirectionalLight(0xcccccc);
        dirLight.position.set(-1, 10, 10);
        this._scene.add(dirLight);

        // 添加一个半球光
        //  let hemiLight = new HemisphereLight( 0xffffff, 0xcccccc );
        //  hemiLight.position.set( 0, 20, 0 );
        //  this._scene.add( hemiLight );
    }


    private createBox(): void {
        console.log("create box")
        // 创建指示的box
        let ary: any[] = [];
        let ecolor = ConstDef.COLOR_SILVER;
        let len: number = 5;

        let right = require('@/assets/img/Right.png');
        let left = require('@/assets/img/Left.png');
        let top = require('@/assets/img/Top.png');
        let bottom = require('@/assets/img/Bottom.png');
        let front = require('@/assets/img/Front.png');
        let back = require('@/assets/img/Back.png');

        this._raycaster = new Raycaster();
        let texture = new TextureLoader();
        let rightTexture = texture.load(right);
        let leftTexture = texture.load(left);
        let topTexture = texture.load(top);
        let bottomTexture = texture.load(bottom);
        let frontTexture = texture.load(front);
        let backTexture = texture.load(back);
        let rightMaterial = new MeshPhongMaterial({ color: ecolor, map: rightTexture });
        let leftMaterial = new MeshPhongMaterial({ color: ecolor, map: leftTexture });
        let topMaterial = new MeshPhongMaterial({ color: ecolor, map: topTexture });
        let bottomMaterial = new MeshPhongMaterial({ color: ecolor, map: bottomTexture });
        let frontMaterial = new MeshPhongMaterial({ color: ecolor, map: frontTexture });
        let backMaterial = new MeshPhongMaterial({ color: ecolor, map: backTexture });
        let materials = [rightMaterial, leftMaterial, topMaterial, bottomMaterial, frontMaterial, backMaterial];

        let geometry = new BoxGeometry(len, len, len);
        const box = new Mesh(geometry, materials);
        box.position.set(0, 0, 0);
        this._scene.add(box);
        // 线框
        // const edges = new EdgesGeometry(geometry);
        // console.log("edfass")
        // const line = new LineLoop(edges, new LineBasicMaterial({ color: ConstDef.COLOR_SILVER }));
        // this._scene.add(line);

        ary.push(box);

        // 创建八个球
        let rad: number = len / 2;
        let pos = [
            rad, rad, rad, // 前右上
            rad, -rad, rad, // 前右下
            -rad, rad, rad, // 前左上
            -rad, -rad, rad, // 前左下
            rad, rad, -rad, // 后右上
            rad, -rad, -rad, // 后右下
            -rad, rad, -rad, // 后左上
            -rad, -rad, -rad // 后左下
        ];
        let count: number = 8;
        for (let i = 0; i < count; i++) {
            const geometry = new SphereGeometry(0.5);
            const material = new MeshPhongMaterial({ color: ecolor });
            const sphere = new Mesh(geometry, material);
            sphere.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
            let idx = i + 6;
            sphere.name = idx.toString();
            this._scene.add(sphere);
            ary.push(sphere);
        }

        //添加边
        let edgPos = [
            { start: [-rad, rad, rad], end: [rad, rad, rad] },
            { start: [rad, rad, rad], end: [rad, rad, -rad] },
            { start: [rad, rad, -rad], end: [-rad, rad, -rad] },
            { start: [-rad, rad, -rad], end: [-rad, rad, rad] },
            { start: [-rad, rad, rad], end: [-rad, -rad, rad] },
            { start: [rad, rad, rad], end: [rad, -rad, rad] },
            { start: [rad, rad, -rad], end: [rad, -rad, -rad] },
            { start: [-rad, rad, -rad], end: [-rad, -rad, -rad] },
            { start: [-rad, -rad, rad], end: [rad, -rad, rad] },
            { start: [rad, -rad, rad], end: [rad, -rad, -rad] },
            { start: [rad, -rad, -rad], end: [-rad, -rad, -rad] },
            { start: [-rad, -rad, -rad], end: [-rad, -rad, rad] }
        ]

        for (let i = 0; i < edgPos.length; i++) {
            // let points = [];
            let data = edgPos[i];
            // points.push( new Vector3(data.start[0], data.start[1], data.start[2] ) );
            // points.push( new Vector3(data.end[0], data.end[1], data.end[2]) );
            // let geometry = new BufferGeometry().setFromPoints(points);
            // let material = new LineBasicMaterial({
            //     color: ConstDef.COLOR_SILVER,
            // });
            // let line = new Line(geometry, material);
            // line.name = (i+14).toString();

            let pointArr = [data.start[0], data.start[1], data.start[2], data.end[0], data.end[1], data.end[2]]

            let geometry = new LineGeometry();
            geometry.setPositions(pointArr);
            var material = new LineMaterial({
                color: ConstDef.COLOR_SILVER,
                linewidth: 30,
                // opacity: 0.1
            })
            material.resolution.set(window.innerWidth, window.innerHeight)
            var line = new Line2(geometry, material);
            line.computeLineDistances();
            line.name = (i + 14).toString();

            this._scene.add(line);
        }


        this.addPointerEvent();
    }

    private addPointerEvent(): void {
        BIM.indicator.addEventListener('pointermove', (event) => {
            this.onPointerMove(event)
        });
        BIM.indicator.addEventListener('pointerout', (event) => {
            this.onPointerOut(event)
        });
        BIM.indicator.addEventListener('pointerdown', (event) => {
            this.onPointerDown(event)
        });
    }

    private removePointerEvent(): void {
        BIM.indicator.removeEventListener('pointermove', (event) => {
            this.onPointerMove(event)
        });
        BIM.indicator.removeEventListener('pointerout', (event) => {
            this.onPointerOut(event)
        });
        BIM.indicator.removeEventListener('pointerdown', (event) => {
            this.onPointerDown(event)
        });
    }

    private onPointerMove(event: any): void {

        if (!this._pointer) {
            this._pointer = new Vector2();
        }
        // console.log("event", event.offsetX, event.offsetY)
        this._pointer.x = (event.offsetX / this._viewWidth) * 2 - 1;
        this._pointer.y = - (event.offsetY / this._viewHeight) * 2 + 1;


    }

    private onPointerOut(event: any): void {
        // console.log("indicator pointer out:", -1)
        this._pointer.x = - 1;
        this._pointer.y = - -1;
        // this.INTERSECTED = null;
    }

    private onPointerDown(event: any): void {
        console.log("indicator pointer down")
        if (!this._pointer) {
            this._pointer = new Vector2();
        }
        this._pointer.x = (event.offsetX / this._viewWidth) * 2 - 1;
        this._pointer.y = - (event.offsetY / this._viewHeight) * 2 + 1;
        this._raycaster.setFromCamera(this._pointer, this._camera);
        const intersects = this._raycaster.intersectObjects(this._scene.children, true);
        if (intersects.length > 0) {
            let faceIndex: number = -1;
            if ((intersects[0].object as Mesh).geometry instanceof SphereGeometry) {
                faceIndex = Number((intersects[0].object as Mesh).name);
            }
            else if ((intersects[0].object as Mesh).geometry instanceof BoxGeometry) {
                faceIndex = intersects[0].face.materialIndex;
            }
            else if ((intersects[0].object as Mesh) instanceof Line2) {
                faceIndex = Number((intersects[0].object as Mesh).name);
            }

            if (faceIndex != -1) {
                this.dispatchEvent({ type: EventDef.INDICATOR_POINT_DOWN, faceIndex: faceIndex })
            }

        }
    }

    private changeFace(): void {
        if (this._pointer && this._raycaster && this._camera) {

            this._raycaster.setFromCamera(this._pointer, this._camera);
            const intersects = this._raycaster.intersectObjects(this._scene.children, true);

            if (intersects.length > 0) {
                // console.log("indicator pointer render:", intersects[ 0 ].face.materialIndex)
                if ((intersects[0].object as Mesh) instanceof Line2) {
                    console.log("edges:", intersects[0].faceIndex);
                    this.clearColor();
                    this.INTERSECTED = intersects[0].object;
                    // this.INTERSECTED.material.opacity = 1.0;
                    this.INTERSECTED.material.color.set(ConstDef.COLOR_DODGER_BLUE);
                }
                else if ((intersects[0].object as Mesh).geometry instanceof SphereGeometry) {
                    // console.log('SphereGeometry');
                    this.clearColor();

                    this._faceIndex = -1;
                    this.INTERSECTED = intersects[0].object;
                    this.INTERSECTED.material.color.set(ConstDef.COLOR_DODGER_BLUE);
                }
                else if (intersects[0].face.materialIndex != this._faceIndex) {

                    this.clearColor();

                    this._faceIndex = intersects[0].face.materialIndex;
                    this.INTERSECTED = intersects[0].object;
                    if (this.INTERSECTED.material[this._faceIndex]) {
                        this.INTERSECTED.material[this._faceIndex].color.set(ConstDef.COLOR_DODGER_BLUE);
                    }
                }

            }
            else {
                this.clearColor();

                this.INTERSECTED = null;
            }
        }
    }

    private clearColor(): void {
        if (this.INTERSECTED) {
            if (this.INTERSECTED.geometry instanceof BoxGeometry &&
                this._faceIndex != -1) {

                if (this.INTERSECTED.material[this._faceIndex]) this.INTERSECTED.material[this._faceIndex].color.set(ConstDef.COLOR_SILVER);
                this._faceIndex = -1;
            }
            else if (this.INTERSECTED.geometry instanceof SphereGeometry) {
                this.INTERSECTED.material.color.set(ConstDef.COLOR_SILVER);
            }
            else if (this.INTERSECTED instanceof Line2) {
                // this.INTERSECTED.material.opacity = 0.1;
                this.INTERSECTED.material.color.set(ConstDef.COLOR_SILVER);
            }
        }
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

    private _faceIndex: number = -1;

    renderView(): void {

        this.changeFace();
    }


    dispose(): void {
        this.removePointerEvent();
    }
}