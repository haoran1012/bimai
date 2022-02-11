
import { BackSide, Box3, Box3Helper, BoxBufferGeometry, BoxGeometry, BoxHelper, BufferGeometry, Camera, CameraHelper, Color, DoubleSide, EdgesGeometry, ExtrudeGeometry, Group, Line, LineBasicMaterial, LineLoop, LineSegments, Mesh, MeshBasicMaterial, MeshPhongMaterial, OrthographicCamera, PerspectiveCamera, Raycaster, Scene, Shape, SphereBufferGeometry, SphereGeometry, TextureLoader, Vec2, Vector2, Vector3, WireframeGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import house from "@/assets/json/housetype.json"
import ConstDef from "@/libs/ConstDef";
import RenderMgr from "@/base/manager/RenderMgr";
import BIM from "@/BIM";
import SceneMgr from "@/base/manager/SceneMgr";
import { Keyboard } from "@/framework/events/Keyboard";
import { UIMgr } from "@/base/manager/UIMgr";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { IFCLoader, IfcModel } from 'three/examples/jsm/loaders/IFCLoader.js';
import CSG from "@/framework/csg/CSG";
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { MeshControlUtils } from "@/base/meshcontrols/meshcontrolUtils";
import { KeyBoardManager } from "@/framework/events/KeyBoardManager";
import EntityMgr from "@/base/manager/EntityMgr";
import CommandMgr from "@/base/manager/CommandMgr";
import CommandTest from "./CommandTest";
export default class TestMod implements IStartUp {
    private static _ins: TestMod;
    public static get ins(): TestMod {
        return TestMod._ins || (TestMod._ins = new TestMod());
    }

    private _enableSelection: boolean = true;
    private controls: DragControls;
    private groups: Group;
    private objects: any[];

    private mouse: Vector2;
    private raycaster: Raycaster;

    private scene: Scene;

    private camera: Camera;

    private moveForward: boolean = false;
    private moveBackward: boolean = false;
    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private prevTime: number;
    private velocity: Vector3;
    private direction: Vector3;
    private sceneMgr: SceneMgr;
    private renderMgr: RenderMgr;
    get enableSelection(): boolean {
        return this._enableSelection;
    }

    set enableSelection(value: boolean) {
        if (value) {
            console.log("可以移动了");
            // (BIM.mgr[ConstDef.WEBGL_RENDER_MGR] as RenderMgr).controls.enabled = !value;
        }

        if (value != this._enableSelection) {
            this._enableSelection = value;
        }
    }

    startUp(): void {

        BIM.ED.on("slect_entity",this, this.entitySelect);
        console.log('test mod startup ');
        this.renderMgr = BIM.mgr[ConstDef.WEBGL_RENDER_MGR] as RenderMgr;
        this.sceneMgr = BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr;
        this.camera = this.sceneMgr.aerial.camera;
        this.scene = this.sceneMgr.aerial.scene;

        // this.addTestCsg();

        this.addKeyListener();

        // this.addBoxS();

        // this.addTestCode();

        this.addStructSect();
    }

    private addStructSect():void {

    }

    private entitySelect(type:number):void{
        console.log('entity selected:', type)
    }

    // readJson(jsonCfg: any): void {
    //     console.log("read json house")
    //     jsonCfg = house;
    //     let minArr: number[];
    //     let scale: number = 100;
    //     let i = 0;
    //     let xyArr = [9999, -9999, 9999, -9999];
    //     let hs: number[] = [];

    //     let group = new Group();
    //     // 地板
    //     let floors = jsonCfg.floor;

    //     for (let floor of floors) {
    //         let datas = floor.value;
    //         let ss: Vector2[] = [];
    //         let vv = [];
    //         hs.push(floor.height);
    //         for (let i = 0; i < datas.length; i += 2) {
    //             let dd = new Vector2(datas[i] / scale, datas[i + 1] / scale);
    //             let v = new Vector3(datas[i] / scale, datas[i + 1] / scale, -floor.depth / scale);
    //             ss.push(dd);
    //             vv.push(v);
    //         }



    //         minArr = MeshControlUtils.single.getPsLWbyPS(ss);
    //         MeshControlUtils.single.getJsonOffset(ss, minArr, xyArr);
    //         let eb = new PathEntity(ss, -floor.depth / scale, 0xcccccc);

    //         // eb.geometry.computeBoundingBox();
    //         // eb.position.x = -(eb.geometry.boundingBox.max.x - eb.geometry.boundingBox.min.x) / 2

    //         eb.mesh.position.set(minArr[0] + minArr[4] / 2, floor.depth / scale / 2 + floor.height / scale, minArr[1] + minArr[5] / 2);
    //         eb.mesh.rotation.x = Math.PI / 2;
    //         // this.scene.add(eb.mesh);
    //         group.add(eb.mesh);
    //     }
    //     // 墙
    //     let walls = jsonCfg.wall;
    //     for (let wall of walls) {
    //         let index = wall.index;
    //         let datas = wall.value;
    //         let ss = [];
    //         let vv = [];
    //         hs.push(wall.height + wall.depth);
    //         for (i = 0; i < datas.length; i += 2) {
    //             let dd = new Vector2(datas[i] / scale, datas[i + 1] / scale);
    //             let v = new Vector3(datas[i] / scale, datas[i + 1] / scale, -wall.depth / scale);
    //             ss.push(dd);
    //             vv.push(v);
    //         }
    //         minArr = MeshControlUtils.single.getPsLWbyPS(ss);
    //         MeshControlUtils.single.getJsonOffset(ss, minArr, xyArr);
    //         let eb = new PathEntity(ss, -wall.depth / scale, 0x555555);
    //         eb.mesh.position.set(minArr[0] + minArr[4] / 2, wall.height / scale + wall.depth / scale / 2, minArr[1] + minArr[5] / 2);
    //         eb.mesh.rotation.x = Math.PI / 2;
    //         // this.scene.add(eb.mesh);
    //         group.add(eb.mesh);
    //         // const material = new LineBasicMaterial({
    //         //     color: 0x0000ff
    //         // });
    //         // const geometry = new BufferGeometry().setFromPoints(vv);

    //         // const line = new LineLoop(geometry, material);
    //         // line.rotation.x = Math.PI / 2;
    //         // this.scene.add(line);

    //         const box = new BoxHelper(eb.mesh, 0xff0000);
    //         // this.scene.add(box);
    //     }
    //     // 梁
    //     let beams = jsonCfg.beam;
    //     for (let beam of beams) {
    //         let datas = beam.value;
    //         let ss = [];
    //         let vv = [];
    //         hs.push(beam.height + beam.depth);
    //         for (let i = 0; i < datas.length; i += 2) {
    //             let dd = new Vector2(datas[i] / scale, datas[i + 1] / scale);
    //             let v = new Vector3(datas[i] / scale, datas[i + 1] / scale, -beam.depth / scale - beam.height / scale);
    //             ss.push(dd);
    //             vv.push(v);
    //         }
    //         minArr = MeshControlUtils.single.getPsLWbyPS(ss);
    //         MeshControlUtils.single.getJsonOffset(ss, minArr, xyArr);
    //         let eb = new PathEntity(ss, -beam.depth / scale, 0x800080);
    //         eb.mesh.position.set(minArr[0] + minArr[4] / 2, beam.height / scale + beam.depth / scale / 2, minArr[1] + minArr[5] / 2);
    //         eb.mesh.rotation.x = Math.PI / 2;
    //         // this.scene.add(eb.mesh);
    //         group.add(eb.mesh);
    //         // const material = new LineBasicMaterial({
    //         //     color: 0x00ff00
    //         // });
    //         // const geometry = new BufferGeometry().setFromPoints(vv);

    //         // const line = new LineLoop(geometry, material);
    //         // line.rotation.x = Math.PI / 2;
    //         // // line.position.y = 
    //         // this.scene.add(line);

    //         // const box = new BoxHelper(eb.mesh, 0xff0000);
    //     }
    //     // 柱子
    //     let pillars = jsonCfg.pillar;
    //     for (let pillar of pillars) {
    //         let datas = pillar.value;
    //         let ss = [];
    //         let vv = [];
    //         hs.push(pillar.height + pillar.depth);
    //         for (let i = 0; i < datas.length; i += 2) {
    //             let dd = new Vector2(datas[i] / scale, datas[i + 1] / scale);
    //             let v = new Vector3(datas[i] / scale, datas[i + 1] / scale, -pillar.depth / scale);
    //             ss.push(dd);
    //             vv.push(v);
    //         }
    //         minArr = MeshControlUtils.single.getPsLWbyPS(ss);
    //         MeshControlUtils.single.getJsonOffset(ss, minArr, xyArr);
    //         let eb = new PathEntity(ss, -pillar.depth / scale, 0x4682b4);
    //         eb.mesh.position.set(minArr[0] + minArr[4] / 2, pillar.height / scale + pillar.depth / scale / 2, minArr[1] + minArr[5] / 2);
    //         eb.mesh.rotation.x = Math.PI / 2;
    //         // this.scene.add(eb.mesh);
    //         group.add(eb.mesh);
    //         // const material = new LineBasicMaterial({
    //         //     color: 0xff0000
    //         // });
    //         // const geometry = new BufferGeometry().setFromPoints(vv);

    //         // const line = new LineLoop(geometry, material);
    //         // line.rotation.x = Math.PI / 2;
    //         // // line.position.y = 
    //         // this.scene.add(line);

    //         // const box = new BoxHelper(eb.mesh, 0xff0000);
    //     }

    //     this.scene.add(group);
    //     console.log("Group:", group);

    //     let h: number = 0;
    //     if (hs.length != 0) {
    //         let min = Math.min(0, ...hs);
    //         let max = Math.max(0, ...hs);
    //         h = (max - min) / 2;
    //         console.log("house:", min, max, h);
    //     }



    //     let center = new Vector3((xyArr[0] + (xyArr[1] - xyArr[0]) / 2), 310 / scale, xyArr[2] + (xyArr[3] - xyArr[2]) / 2);
    //     this.sceneMgr.center = center.clone();
    //     this.sceneMgr.aerial.controls.target = center.clone();
    //     BIM.timer.callLater(this, this.changeCamePos);
    // }

    private changeCamePos(): void {
        this.sceneMgr.onPointDow(ConstDef.FRONT_LEFT_TOP);
    }

    private addTestCode(): void {

        var geometry = new LineGeometry()
        var pointArr = [-100, 0, 0, -100, 100, 0]
        geometry.setPositions(pointArr)
        var material = new LineMaterial({
            color: ConstDef.COLOR_ORANGE,
            linewidth: 15
        })
        material.resolution.set(window.innerWidth, window.innerHeight)
        var line = new Line2(geometry, material)
        line.computeLineDistances()
        this.scene.add(line)
    }

    private testBox(): void {
        const length = 1.2, width = 0.8;

        const shape = new Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, width);
        shape.lineTo(length, width);
        shape.lineTo(length, 0);
        shape.lineTo(0, 0);

        const extrudeSettings = {
            steps: 2,
            depth: 1.6,
            bevelEnabled: false,
            // bevelThickness: 1,
            // bevelSize: 1,
            // bevelOffset: 0,
            // bevelSegments: 1
        };

        const geometry = new ExtrudeGeometry(shape, extrudeSettings);
        const material = new MeshPhongMaterial({
            color: 0xcccccc,
            side: DoubleSide,
            wireframe: false
        });

        const mesh = new Mesh(geometry, material);
        this.scene.add(mesh);

        // // 线框
        // const box = new BoxHelper(mesh, 0xff0000);
        // this.scene.add(box);


        const box3 = new Box3();
        box3.setFromCenterAndSize(new Vector3(1, 1, 1), new Vector3(2, 1, 3));

        // const helper = new Box3Helper(box3, new Color(0xff0000));
        // this.scene.add(helper);

        this.groups = new Group();
        this.scene.add(this.groups);

        this.objects = [];
        this.objects.push(mesh);

        this.mouse = new Vector2();
        this.raycaster = new Raycaster();

        // this.controls = new DragControls(this.objects, this.camera, rendermgr.render3d.domElement);
        // this.controls.addEventListener('drag', () => {

        // });

        // this.controls.addEventListener('dragstart', () => {

        //     // (BIM.mgr[ConstDef.WEBGL_RENDER_MGR] as RenderMgr).controls.enabled = false;
        // });

        // this.controls.addEventListener('dragend', () => {

        //     // (BIM.mgr[ConstDef.WEBGL_RENDER_MGR] as RenderMgr).controls.enabled = true;
        // });
    }

    private addBoxS(): void {

        let mt_1 = new MeshPhongMaterial({
            color: 0xff0000,
            side: DoubleSide,
            transparent: true,
            depthWrite: false,
            opacity: 0.75
        })

        let mt_2 = new MeshPhongMaterial({
            color: ConstDef.COLOR_GREEN,
            side: DoubleSide,
            transparent: true,
            // depthWrite: false,
            depthTest: false,
            opacity: 0.2
        })

        let geo_1 = new BoxBufferGeometry(1, 1, 1);
        let geo_2 = new BoxBufferGeometry(2, 2, 2);

        let box_1 = new Mesh(geo_1, mt_1);
        let box_2 = new Mesh(geo_2, mt_2);

        this.scene.add(box_1);
        this.scene.add(box_2);

        // var material = new MeshBasicMaterial({ map: texture1, transparent: true, side: DoubleSide, depthWrite: false });
        // const geometry = new BoxGeometry( 100, 100, 100 );
        const edges = new EdgesGeometry(geo_2);
        const line = new LineSegments(edges, new LineBasicMaterial({ color: ConstDef.COLOR_GREEN, depthTest: false, }));
        box_2.add(line);
        box_2.position.set(-10, 0, 0)
        box_2.renderOrder = 1;
        // this.scene.add( line );

    }


    private addTestCsg(): void {

        let material = new MeshPhongMaterial({
            color: 0xff0000
        })
        const box = new Mesh(new BoxBufferGeometry(0.2, 0.2, 1), material);
        box.position.set(0.1, 0.1, 0);

        let smaterial = new MeshPhongMaterial({
            color: 0x00ff00
        })
        const sphere = new Mesh(new SphereBufferGeometry(0.1), smaterial);
        sphere.position.set(0, 0, -0.3);

        const sphereB = sphere.clone();
        sphereB.position.set(0, 0, 0.3);

        const csg = new CSG();

        csg.subtract([box, sphere, sphereB]);
        // csg.union([box, sphere, sphereB]);
        // csg.intersect([box, sphere]);

        const resultMesh = csg.toMesh();
        resultMesh.position.set(-5, 0, 0)
        this.scene.add(resultMesh);
    }

    /** 添加按键的监听 */
    private addKeyListener(): void {
        // 添加按键监听
        let that = this;
        document.onkeydown = function (event) {
            let e = event || window.event || arguments.callee.caller.arguments[0];
            if (!e) return;
            console.log("key_down:", e.keyCode);
            switch (e.keyCode) {
                case Keyboard.ESCAPE:
                    that.escPress();
                    break;
                case Keyboard.H:
                    that.hideUI();
                    break;
                case Keyboard.R:
                    that.chaneRoamMode()
                    break;
                case Keyboard.NUMBER_1:
                    that.changeBackground(1);
                    break;
                case Keyboard.NUMBER_2:
                    that.changeBackground(2);
                    break;
                case Keyboard.NUMBER_3:
                    that.changeBackground(3);
                    break;
                case Keyboard.L:
                    that.loadBuilding();
                    break;
                case Keyboard.P:
                    that.changeCamera();
                    break;
                case Keyboard.K:
                    that.selectEntiy();

            }
            let cmdMgr = BIM.mgr[ConstDef.COMMAND_MGR] as CommandMgr;
            if(e.keyCode == Keyboard.Z && e.ctrlKey) {
                console.log('ctrl + Z');
                cmdMgr.undo();
            }
            else if(e.keyCode == Keyboard.Y && e.ctrlKey){
                console.log('ctrl + Y');
                cmdMgr.redo();
            }
        };

        

        // if (KeyBoardManager.hasKeyDown(Keyboard.F)) {
        //     console.log("KeyBoardManager：", Keyboard.F);
        // }
        // if (KeyBoardManager.hasKeyDown(Keyboard.B)) {
        //     console.log("KeyBoardManager：", Keyboard.B);
        // }
        // if (KeyBoardManager.hasKeyDown(Keyboard.N)) {
        //     console.log("KeyBoardManager：", Keyboard.N);
        // }
        // if (KeyBoardManager.hasKeyDown(Keyboard.M)) {
        //     console.log("KeyBoardManager：", Keyboard.M);
        // }
        // if (KeyBoardManager.hasKeyDown(Keyboard.V)) {
        //     console.log("KeyBoardManager：", Keyboard.V);
        // }
    }

    private _type: number = -1; // 0 wall 1 beam 2 pillar 3 floor 
    private selectEntiy(): void {
        console.log("select entity")

        this.changeType();

        let emgr = BIM.mgr[ConstDef.ENTITY_MGR] as EntityMgr;
        // 清除上一个
        let li = this._type == -1 ? 3 : this._type - 1;
        let le = this.getTY(li);
        if (le) {
            let last = emgr.getEntityByType(le)
            for (let la of last) {
                la.selected = false;
            }
        }

        // 选中下一个
        let et = this.getTY(this._type);
        if (et) {
            let entitys = emgr.getEntityByType(et);

            for (let entity of entitys) {
                entity.selected = true;
            }
        }

        BIM.ED.event("slect_entity", this._type);
    }

    getTY(type: number): string {
        let et: string = type == 0 ? 'wall' :
            type == 1 ? 'beam' :
                type == 2 ? 'pillar' :
                    type == 3 ? 'floor' : null;
        return et;
    }


    private changeType(): void {
        this._type = this._type > 3 ? -1 : this._type + 1;
    }

    private changeCamera(): void {
        this.camera = this.sceneMgr.aerial.camera
        if (!this.camera || BIM.viewmode != 0) return;
        if (this.camera instanceof PerspectiveCamera) {
            this.sceneMgr.aerial.changeCamera(1);
        }
        else if (this.camera instanceof OrthographicCamera) {
            this.sceneMgr.aerial.changeCamera(0);
        }
        else {
            console.error("3D场景切换相机时，类型出错。")
        }

    }

    /** 加载.ifc 建筑 */
    private loadBuilding(): void {
        console.log("ifc-starttime:", Date.now())
        let ifcLoader = new IFCLoader();
        let ifcres = require("@/assets/model/rac_advanced_sample_project.ifc")
        ifcLoader.ifcManager.setWasmPath("/wasmDir/ifc/");
        ifcLoader.load(ifcres, (model) => this.buildingLoaded(model));
    }

    /** 建筑加载完毕 */
    private buildingLoaded(model: any): void {
        console.log("ifc-endtime:", Date.now())
        console.log("IFC：", model)
        this.scene.add(model.mesh);

        // let childs = this._scene.children
        // const insect =  childs.filter(insect=> insect instanceof Mesh);
        // console.log(insect);
        // let clone = model.mesh.clone();
        // clone.position.x = 200
        // this._scene.add(clone)

    }


    private addMapBox(): void {
        var Sphere = new SphereGeometry(100);
        // MeshPhongMaterial、MeshLambertMaterial光照会产生不连贯的棱角感
        // 使用不用光照影响的基础网格材质MeshBasicMaterial
        var material = new MeshBasicMaterial({
            color: 0xffffff,
            //注意背面显示
            side: BackSide,
        });
        var mesh = new Mesh(Sphere, material);

        // 设置材质对象的纹理贴图
        let right = require('@/assets/img/bluesky.jpg');
        var textureLoader = new TextureLoader();
        mesh.material.map = textureLoader.load(right);
        this.scene.add(mesh);

        // this._camera.position.set(4.4, -0.517, -3.81);
        // this._camera.lookAt(this._scene.position);
    }

    private addSkyBox(): void {

        let right = require('@/assets/img/EnvMap_right.jpg');
        let left = require('@/assets/img/EnvMap_left.jpg');
        let top = require('@/assets/img/EnvMap_top.jpg');
        let bottom = require('@/assets/img/EnvMap_bottom.jpg');
        let front = require('@/assets/img/EnvMap_front.jpg');
        let back = require('@/assets/img/EnvMap_back.jpg');

        let ecolor = ConstDef.COLOR_SILVER;
        let texture = new TextureLoader();
        let rightTexture = texture.load(right);
        let leftTexture = texture.load(left);
        let topTexture = texture.load(top);
        let bottomTexture = texture.load(bottom);
        let frontTexture = texture.load(front);
        let backTexture = texture.load(back);
        let rightMaterial = new MeshPhongMaterial({ color: ecolor, map: rightTexture, side: BackSide });
        let leftMaterial = new MeshPhongMaterial({ color: ecolor, map: leftTexture, side: BackSide });
        let topMaterial = new MeshPhongMaterial({ color: ecolor, map: topTexture, side: BackSide });
        let bottomMaterial = new MeshPhongMaterial({ color: ecolor, map: bottomTexture, side: BackSide });
        let frontMaterial = new MeshPhongMaterial({ color: ecolor, map: frontTexture, side: BackSide });
        let backMaterial = new MeshPhongMaterial({ color: ecolor, map: backTexture, side: BackSide });
        let materials = [rightMaterial, leftMaterial, topMaterial, bottomMaterial, frontMaterial, backMaterial];

        let geometry = new BoxGeometry(500, 500, 500);
        const box = new Mesh(geometry, materials);
        box.position.set(0, 0, 0);
        this.scene.add(box);
    }

    /** 切换场景的背景 */
    private changeBackground(mode: number): void {
        (BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr).bg.changeBackground(mode);
    }


    /** 切换到漫游模式 */
    private chaneRoamMode(): void {

        BIM.viewmode = BIM.viewmode == 1 ? 2 : BIM.viewmode == 0 ? 1 : BIM.viewmode == 2 ? 0 : -1;
        if (BIM.viewmode == -1) {
            alert('视图模式切换错误')
            return;
        }
        (BIM.mgr[ConstDef.WEBGL_RENDER_MGR] as RenderMgr).changeViewMode();
    }

    /** Esc 键退出 */
    private escPress(): void {

    }

    /** 隐藏界面 */
    private hideUI(): void {
        (BIM.mgr[ConstDef.UI_MGR] as UIMgr).uiLayer.element.hidden = !(BIM.mgr[ConstDef.UI_MGR] as UIMgr).uiLayer.element.hidden
    }
}