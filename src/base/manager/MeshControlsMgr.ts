import * as THREE from 'three';
import RenderMgr from './RenderMgr';
import SceneMgr from './SceneMgr';
import { AxesHelper, Box3, Box3Helper, BoxHelper, Curve, CylinderGeometry, Float32BufferAttribute, GridHelper, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneBufferGeometry, Raycaster, Shape, ShapeBufferGeometry, TextureLoader, TorusGeometry, Vector2, Vector3 } from 'three';
import TFControls from '../meshcontrols/TFControls';
import { MeshControlconst } from '../meshcontrols/meshControlconst';
import { MeshControlUtils } from '../meshcontrols/meshcontrolUtils';
import { BIMAIMesh } from '../meshcontrols/BIMAIMesh';
import { BIMAIGroup } from '../meshcontrols/BIMAIGroup';
import ConstDef from '@/libs/ConstDef';
import BIM from '@/BIM';
import { Keyboard } from '@/framework/events/Keyboard';
import AerialScene from '../scene/AerialScene';
import eventInstance from '@/plugin/eventTower';
import { EventConst } from '@/plugin/eventTower/EventConst';
import HudScene from '../scene/HudScene';
import { Mouse } from '@/framework/utils/Mouse';
import BaseUtls from '../utils/BaseUtls';
export default class MeshControlsMgr implements IMgr {
    private renderman: RenderMgr;
    private sceneman: AerialScene;
    private sceneman2: HudScene;
    private transformControls: TFControls;
    private selectBox: Box3Helper;
    private textureLoader: TextureLoader;
    private raycaster: Raycaster;
    private aspect: number;
    private meshs: any[] = [];
    private _selectMeshs: any[];
    private tempSelectGroup: BIMAIGroup;
    private isCtrl: boolean = false;
    private tempMeshGroup: BIMAIGroup;
    private drawLineMeshArr: Vector3[];
    private drawLinePoints: Vector2[] = [];
    private isStartDrawType: number = 0;
    private tempDrawLineMeshArr: BIMAIMesh[] = [];
    private drawMeshArr: BIMAIMesh[] = [];
    private startTime: number = 0;
    /** 默认是0材质-线框  1材质  2线框 */
    private _meshMode: number = 0;

    constructor() {
        // this.camerman = (BIM.mgr[ConstDef.CAMERA_MGR] as CameraMgr);
        // this.renderman = (BIM.mgr[ConstDef.WEBGL_RENDER_MGR] as RenderMgr);
        this.raycaster = new Raycaster();
        this.textureLoader = new TextureLoader();
        this.aspect = window.innerWidth / window.innerHeight;
        this._selectMeshs = [];
    }

    set MeshMode(num: number) {
        this._meshMode = num;
    }
    get MeshMode(): number {
        return this._meshMode;
    }

    get selectMeshs(): any[] {

        return this._selectMeshs;
    }

    public jsonparse(json: object): void {
        // var res = JSON.stringify(o);
        let i: number, j: number;
        let wallarr = [];
        let meshs = [];
        let test = [];
        if (json) {
            if (json['wall']) {
                let walls = json['wall'];
                for (i = 0; i < walls.length; i++) {
                    let wall = walls[i];
                    test = MeshControlUtils.single.getOriginalPointandPosition(wall.ps);
                    let geom = MeshControlUtils.single.extrudeBufferGeometry(wall.ps, wall.depth);
                    wallarr.push({ g: geom, p: test });
                }
            }
            for (i = 0; i < wallarr.length; i++) {
                let mesh = new BIMAIMesh(wallarr[i].g, new MeshPhongMaterial({ color: 0xff0000 }));
                mesh.position.set(wallarr[i].p[0], 0, wallarr[i].p[1]);
                mesh.name = 'wall_' + i;
                // this.sceneman.scene.add(mesh);
                meshs.push(mesh);
            }
        }
    }

    private clearSelectMesh(): void {
        let i, j;
        for (i = 0; i < this._selectMeshs.length; i++) {
            this._selectMeshs[i].WireFrame = false;
            if (this._selectMeshs[i] instanceof BIMAIGroup) {
                for (j = 0; j < this._selectMeshs[i].children.length; j++) {
                    this._selectMeshs[i].children[j].WireFrame = false;
                }
            }
        }
        if (this.tempMeshGroup) {
            this.tempMeshGroup.WireFrame = false;
            for (i = this.tempMeshGroup.children.length - 1; i > -1; i--) {
                this.tempMeshGroup.children[i].position.add(this.tempMeshGroup.position);
                // this.sceneman.scene.add(this.tempMeshGroup.children[i]);
                MeshControlUtils.single.addMesh(this.meshs, this.tempMeshGroup.children[i], this.sceneman.scene);
            }
            // this.sceneman.scene.remove(this.tempMeshGroup);
            MeshControlUtils.single.removeMesh(this.meshs, this.tempMeshGroup, this.sceneman.scene);
            this.tempMeshGroup = null;
        }
    }

    private refreshMeshstate(): void {
        let i: number, j: number, box: Box3;
        if (this._selectMeshs.length > 1) {
            if (!this.tempMeshGroup) {
                this.tempMeshGroup = new BIMAIGroup();
            }
            for (i = 0; i < this._selectMeshs.length; i++) {
                this.tempMeshGroup.add(this._selectMeshs[i]);
                this._selectMeshs[i].WireFrame = true;
            }
            this.tempMeshGroup.updateWireFrame();
            this.tempMeshGroup.WireFrame = true;
            MeshControlUtils.single.addMesh(this.meshs, this.tempMeshGroup, this.sceneman.scene);
            // this.sceneman.scene.add(this.tempMeshGroup);
        } else {
            for (i = 0; i < this._selectMeshs.length; i++) {
                this._selectMeshs[i].WireFrame = true;
                if (this._selectMeshs[i] instanceof BIMAIGroup) {
                    for (j = 0; j < this._selectMeshs[i].children.length; j++) {
                        this._selectMeshs[i].children[j].WireFrame = true;
                    }
                }
            }
            // console.log('+++++++++++++++'+this._selectMeshs[0].name);
        }
    }

    private commonMeshs(): void {
        let i: number, j: number;
        let group = new BIMAIGroup();
        for (i = 0; i < this._selectMeshs.length; i++) {
            if (this._selectMeshs[i] instanceof BIMAIGroup) {
                this._selectMeshs[i].WireFrame = false;
                for (j = this._selectMeshs[i].children.length - 1; j > -1; j--) {
                    group.add(this._selectMeshs[i].children[j]);
                    // this._selectMeshs[i].children[j].position.add(vvvv);
                }
                this.sceneman.scene.remove(this._selectMeshs[i]);
            } else {
                group.add(this._selectMeshs[i]);
                // this._selectMeshs[i].position.add(new Vector3(-vvvv.x,-vvvv.y,-vvvv.z));
            }
        }
        group.WireFrame = true;
        this._selectMeshs = [group];
        MeshControlUtils.single.addMesh(this.meshs, group, this.sceneman.scene);
        // this.sceneman.scene.add(group);
        this.transformControls.attach(group);
        if (this.tempMeshGroup) {
            this.tempMeshGroup.WireFrame = false;
            MeshControlUtils.single.removeMesh(this.meshs, this.tempMeshGroup, this.sceneman.scene);
            // this.sceneman.scene.remove(this.tempMeshGroup);

        }
        // this.transformControls.attach(group);
    }

    private splitMeshs(): void {
        let i: number, j: number;
        // this.selectBox.visible = false;
        for (i = 0; i < this._selectMeshs.length; i++) {
            if (this._selectMeshs[i] instanceof BIMAIGroup) {
                this._selectMeshs[i].WireFrame = false;
                for (j = this._selectMeshs[i].children.length - 1; j > -1; j--) {
                    this._selectMeshs[i].children[j].WireFrame = false;
                    this.sceneman.scene.add(this._selectMeshs[i].children[j]);
                }
                this.sceneman.scene.remove(this._selectMeshs[i]);
            }
        }
        this._selectMeshs = [];
    }

    private getTimeNow(): number {
        return new Date().getTime();
    }

    startUp(): void {
        let wall1 = [{ x: -50, y: 0 }, { x: -50, y: 30 }, { x: 50, y: 15 }, { x: 50, y: 5 }];
        let wall2 = [{ x: 50, y: 5 }, { x: 50, y: 15 }, { x: 150, y: 30 }, { x: 150, y: 0 }];
        let wall3 = [{ x: 150, y: 0 }, { x: 150, y: 30 }, { x: 250, y: 15 }, { x: 250, y: 0 }];
        this.sceneman = (BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr).aerial;
        this.sceneman2 = (BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr).hud;
        // console.log(BIM.viewmode);
        // let wall4 = [{x:50,y:5},{x:50,y:15},{x:150,y:30},{x:150,y:0}];
        let jsonobject = {
            'wall': [{ id: 1, ps: wall1, depth: 10 }, { id: 2, ps: wall2, depth: 10 }, { id: 3, ps: wall3, depth: 10 }]
        };
        this.jsonparse(jsonobject);
        var thatt = this;
        this.transformControls = new TFControls(this.sceneman.camera, this.sceneman.render.domElement, this.sceneman.scene);
        this.transformControls.name = MeshControlconst.NO_S + '_' + MeshControlconst.TFCS;
        this.sceneman.scene.add(this.transformControls);
        this.transformControls.addEventListener('dragging-changed', function (event) {
            thatt.sceneman.controls.enabled = !event.value;
            Mouse.cursor = 'auto'
        });
        const onPointer3DDown = function (event: any) {

            if (event.button === 1 || event.button === 2) return;
            let isselectMesh = false;
            let downSelectObject = null;
            let tempObject = null;
            let i: number;
            let xy = new Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
            if (thatt.isStartDrawType) {//添加画得模型
                if (!thatt.drawLineMeshArr) {
                    thatt.drawLineMeshArr = [];
                }
                thatt.raycaster.setFromCamera(xy, thatt.sceneman.camera);
                const intersects22 = thatt.raycaster.intersectObject(thatt.sceneman.PlaneMesh, false);
                if (intersects22.length > 0) {
                    thatt.drawLinePoints.push(xy.clone());
                    thatt.drawLineMeshArr.push(intersects22[0].point)
                }
                if (thatt.drawLineMeshArr.length > 1) {
                    for (i = 0; i < thatt.tempDrawLineMeshArr.length; i++) {
                        thatt.sceneman.scene.remove(thatt.tempDrawLineMeshArr[i]);
                    }
                    thatt.tempDrawLineMeshArr = [];
                    for (i = 0; i < thatt.drawLineMeshArr.length; i++) {
                        if (thatt.drawLineMeshArr.length > i) {
                            let c = MeshControlUtils.single.getBIMAITypeMesh([thatt.drawLineMeshArr[i], thatt.drawLineMeshArr[i + 1]], thatt.drawLinePoints, thatt.isStartDrawType);
                            let drawname = MeshControlUtils.single.getNameByType(thatt.isStartDrawType);
                            c.name = drawname === null ? '' : drawname;
                            MeshControlUtils.single.addMesh(thatt.meshs, c, thatt.sceneman.scene);
                            thatt.tempDrawLineMeshArr = [];
                            thatt.drawLineMeshArr = [];
                            thatt.drawLinePoints = [];
                            thatt.isStartDrawType = MeshControlconst.DRAW_Mesh_NO;
                            break;
                        }
                    }
                }
                return;
            }
            let selectTranControl = thatt.transformControls.getDownTranControl(event);
            if (selectTranControl && selectTranControl.hasOwnProperty('name') && selectTranControl.name) {
                if (selectTranControl.name === MeshControlconst.NOS_X_TRANSLATE || selectTranControl.name === MeshControlconst.NOS_Y_TRANSLATE
                    || selectTranControl.name === MeshControlconst.NOS_Z_TRANSLATE || selectTranControl.name === MeshControlconst.NOS_X_ROTATE
                    || selectTranControl.name === MeshControlconst.NOS_Y_ROTATE || selectTranControl.name === MeshControlconst.NOS_Z_ROTATE) {
                    thatt.transformControls.MoveType = selectTranControl.name;
                    thatt.transformControls.onControlPointerDown(event);
                    // console.log('type1__'+thatt.transformControls.MoveType);
                }
                return;
            }
            thatt.raycaster.setFromCamera(xy, thatt.sceneman.camera);
            let intersects = thatt.raycaster.intersectObject(thatt.sceneman.scene, true);
            if (intersects.length > 0) {
                MeshControlUtils.single.noSelectWireFrame(intersects);
            }
            if (intersects.length > 0) {
                const selectedObject = intersects[0].object;
                // console.log(selectedObject.name);

                if (selectedObject !== null && selectedObject !== thatt.sceneman.scene && selectedObject !== thatt.sceneman.camera
                    && selectedObject.name.indexOf('nos') === -1 && !(selectedObject instanceof GridHelper) && !(selectedObject instanceof AxesHelper)) {
                    if (selectedObject.parent && (selectedObject.parent instanceof BIMAIGroup)) {
                        downSelectObject = selectedObject.parent;
                    } else if (selectedObject.parent && (selectedObject.parent instanceof BIMAIMesh)) {
                        if (selectedObject instanceof LineSegments && selectedObject.parent.parent && selectedObject.parent.parent instanceof BIMAIGroup) {
                            downSelectObject = selectedObject.parent.parent;
                        } else {
                            downSelectObject = selectedObject.parent;
                        }
                    } else {
                        downSelectObject = selectedObject;
                    }

                    console.table(thatt._selectMeshs);
                    if (thatt.tempMeshGroup) {
                        tempObject = MeshControlUtils.single.searchMeshs(thatt.tempMeshGroup.children, downSelectObject);
                        if (thatt.tempMeshGroup === downSelectObject || tempObject.bo) {
                            thatt.transformControls.attach(thatt.tempMeshGroup);
                            thatt.transformControls.onControlPointerDown(event);
                            return;
                        }
                    }

                    thatt.clearSelectMesh();
                    if (thatt.isCtrl) {
                        tempObject = MeshControlUtils.single.searchMeshs(thatt._selectMeshs, downSelectObject);
                        if (tempObject && tempObject.bo) {
                            thatt._selectMeshs.splice(tempObject.id, 1);
                        } else {
                            thatt._selectMeshs.push(downSelectObject);



                            eventInstance.dispatchEvent(EventConst.SELECT_CHANGE, thatt._selectMeshs);
                        }
                    } else {

                        thatt._selectMeshs = [downSelectObject];

                        // console.table(thatt._selectMeshs);

                        eventInstance.dispatchEvent(EventConst.SELECT_CHANGE, thatt._selectMeshs);
                    }
                    isselectMesh = true;
                    thatt.refreshMeshstate();
                    if (thatt._selectMeshs && thatt._selectMeshs.length > 0) {
                        if (thatt._selectMeshs.length > 1) {
                            thatt.transformControls.attach(thatt.tempMeshGroup);
                        } else {
                            thatt.transformControls.attach(thatt._selectMeshs[0]);
                        }
                        thatt.transformControls.onControlPointerDown(event);
                    }
                }

            }
            thatt.startTime = 0;
            if (!isselectMesh) {
                thatt.startTime = thatt.getTimeNow();
                // thatt.clearSelectMesh();
                // thatt._selectMeshs = [];
                // thatt.transformControls.detach();
            }

            /** 当前选中的物体中心点 */
            // if (thatt._selectMeshs && thatt._selectMeshs.length > 0) {
            //     let pos = BaseUtls.getMeshsCenter(thatt._selectMeshs);
            //     console.log('slect pos:', pos.x, pos.y, pos.z);
            //     let sceneMgr = (BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr);
            //     sceneMgr.aerial.controls.target = pos.clone();
            //     sceneMgr.onPointDow(ConstDef.FRONT_LEFT_TOP);
            //     sceneMgr.hud.controls.update();
            // }
        }

        const onPointer2DDown = function (event: any) {
            let i: number, j: number;
            if (event.button === 1 || event.button === 2) return;
            let isselectMesh = false;
            let downSelectObject = null;
            let tempObject = null;
            let xy = new Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
            if (thatt.isStartDrawType) {
                thatt.raycaster.setFromCamera(xy, thatt.sceneman2.camera);
                const intersects22 = thatt.raycaster.intersectObject(thatt.sceneman.PlaneMesh, true);
                if (intersects22.length > 0) {
                    if (!thatt.drawLineMeshArr) {
                        thatt.drawLineMeshArr = [];
                        thatt.drawMeshArr = [];
                    }
                    thatt.drawLinePoints.push(xy.clone());
                    thatt.drawLineMeshArr.push(intersects22[0].point);
                    if (thatt.drawLineMeshArr.length > 1) {
                        for (i = 0; i < thatt.tempDrawLineMeshArr.length; i++) {
                            thatt.sceneman.scene.remove(thatt.tempDrawLineMeshArr[i]);
                        }
                        for (i = 0; i < thatt.drawMeshArr.length; i++) {
                            thatt.sceneman.scene.remove(thatt.drawMeshArr[i]);
                        }
                        thatt.tempDrawLineMeshArr = [];
                        for (i = 0; i < thatt.drawLineMeshArr.length; i++) {
                            if (thatt.drawLineMeshArr.length > i + 1) {
                                let c = MeshControlUtils.single.getBIMAITypeMesh([thatt.drawLineMeshArr[i], thatt.drawLineMeshArr[i + 1]], thatt.drawLinePoints, thatt.isStartDrawType);
                                let drawname = MeshControlUtils.single.getNameByType(thatt.isStartDrawType);
                                c.name = drawname === null ? '' : drawname;
                                MeshControlUtils.single.addMesh(thatt.meshs, c, thatt.sceneman.scene);
                                thatt.drawMeshArr.push(c);
                            }
                        }
                        // if(thatt.drawMeshArr.length > 1){
                        //     let ms = MeshControlUtils.single.getCutAngleMesh(thatt.drawMeshArr);
                        //     for(j=0;j<ms.length;j++){
                        //         thatt.sceneman.scene.add(ms[j]);
                        //     }
                        // }
                    }
                }
            }
            thatt.raycaster.setFromCamera(xy, thatt.sceneman2.camera);
            let intersects = thatt.raycaster.intersectObject(thatt.sceneman.scene, true);
            if (intersects.length > 0) {
                MeshControlUtils.single.noSelectWireFrame(intersects);
            }
            if (intersects.length > 0) {
                const selectedObject = intersects[0].object;
                if (selectedObject !== null && selectedObject !== thatt.sceneman.scene && selectedObject !== thatt.sceneman.camera
                    && selectedObject.name.indexOf('nos') === -1 && !(selectedObject instanceof GridHelper) && !(selectedObject instanceof AxesHelper)) {
                    if (selectedObject.parent && (selectedObject.parent instanceof BIMAIGroup)) {
                        downSelectObject = selectedObject.parent;
                    } else if (selectedObject.parent && (selectedObject.parent instanceof BIMAIMesh)) {
                        if (selectedObject instanceof LineSegments && selectedObject.parent.parent && selectedObject.parent.parent instanceof BIMAIGroup) {
                            downSelectObject = selectedObject.parent.parent;
                        } else {
                            downSelectObject = selectedObject.parent;
                        }
                    } else {
                        downSelectObject = selectedObject;
                    }

                    // console.table(thatt._selectMeshs);
                    // if(thatt.tempMeshGroup){
                    //     tempObject = MeshControlUtils.single.searchMeshs(thatt.tempMeshGroup.children,downSelectObject);
                    //     if(thatt.tempMeshGroup === downSelectObject || tempObject.bo){
                    //         thatt.transformControls.attach(thatt.tempMeshGroup);
                    //         thatt.transformControls.onControlPointerDown(event);
                    //         return;
                    //     }
                    // }

                    thatt.clearSelectMesh();
                    if (thatt.isCtrl) {
                        tempObject = MeshControlUtils.single.searchMeshs(thatt._selectMeshs, downSelectObject);
                        if (tempObject && tempObject.bo) {
                            thatt._selectMeshs.splice(tempObject.id, 1);
                        } else {
                            thatt._selectMeshs.push(downSelectObject);



                            eventInstance.dispatchEvent(EventConst.SELECT_CHANGE, thatt._selectMeshs);
                        }
                    } else {

                        thatt._selectMeshs = [downSelectObject];

                        // console.table(thatt._selectMeshs);

                        eventInstance.dispatchEvent(EventConst.SELECT_CHANGE, thatt._selectMeshs);
                    }
                    isselectMesh = true;
                    thatt.refreshMeshstate();
                    // if(thatt._selectMeshs && thatt._selectMeshs.length > 0){
                    //     if(thatt._selectMeshs.length > 1){
                    //         thatt.transformControls.attach(thatt.tempMeshGroup);
                    //     }else{
                    //         thatt.transformControls.attach(thatt._selectMeshs[0]);
                    //     }
                    //     thatt.transformControls.onControlPointerDown(event);
                    // }
                }

            }
            if (!isselectMesh) {
                thatt.clearSelectMesh();
                thatt._selectMeshs = [];
                thatt.transformControls.detach();

            }
        }
        const onPointer2DMove = function (event: any) {
            if (thatt.isStartDrawType) {
                let xy = new Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
                thatt.raycaster.setFromCamera(xy, thatt.sceneman2.camera);
                const intersects22 = thatt.raycaster.intersectObject(thatt.sceneman.PlaneMesh, true);
                if (intersects22.length > 0) {
                    if (!thatt.drawLineMeshArr) {
                        thatt.drawLineMeshArr = [];
                    }
                    for (let i = 0; i < thatt.tempDrawLineMeshArr.length; i++) {
                        thatt.sceneman.scene.remove(thatt.tempDrawLineMeshArr[i]);
                    }
                    if (thatt.drawLineMeshArr.length > 0) {
                        thatt.tempDrawLineMeshArr = [];
                        let c = MeshControlUtils.single.getBIMAITypeMesh([thatt.drawLineMeshArr[thatt.drawLineMeshArr.length - 1], intersects22[0].point], [thatt.drawLinePoints[thatt.drawLineMeshArr.length - 1], xy], thatt.isStartDrawType);
                        thatt.sceneman.scene.add(c);
                        thatt.tempDrawLineMeshArr.push(c);
                    }
                }
            }
        }
        const onPointer3DMove = function (event: any) {
            if (thatt.isStartDrawType) {
                let xy = new Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
                if (!thatt.drawLineMeshArr) {
                    thatt.drawLineMeshArr = [];
                }
                thatt.raycaster.setFromCamera(xy, thatt.sceneman.camera);
                const intersects22 = thatt.raycaster.intersectObject(thatt.sceneman.PlaneMesh, true);
                if (intersects22.length > 0) {
                    if (thatt.drawLineMeshArr.length > 0) {
                        for (let i = 0; i < thatt.tempDrawLineMeshArr.length; i++) {
                            thatt.sceneman.scene.remove(thatt.tempDrawLineMeshArr[i]);
                        }
                        thatt.tempDrawLineMeshArr = [];
                        let c = MeshControlUtils.single.getBIMAITypeMesh([thatt.drawLineMeshArr[0], intersects22[0].point], [thatt.drawLinePoints[0], xy], thatt.isStartDrawType);
                        thatt.sceneman.scene.add(c);
                        thatt.tempDrawLineMeshArr.push(c);
                    }
                }
                return;
            }
            thatt.transformControls.onControlPointerMove(event);
        }
        const onPointer3DUp = function (event: any) {
            let timeEnd = new Date().getTime();//也就是每100毫秒获取一次时间
            if (!(timeEnd - thatt.startTime > 300)) {
                thatt.clearSelectMesh();
                thatt._selectMeshs = [];
                thatt.transformControls.detach();
            }
        }
        const keyDown = function (event: any) {
            thatt.isCtrl = event.ctrlKey;
            switch (event.keyCode) {
                case Keyboard.CONTROL:
                    break;
            }
        }
        const keyUp = function (event: any) {
            let i: number, j: number;
            console.log('keyboard_' + event.keyCode);
            thatt.isCtrl = event.ctrlKey;
            switch (event.keyCode) {
                case Keyboard.N:
                    thatt._meshMode = thatt._meshMode > 0 ? 0 : 1;
                    break;
                case Keyboard.ESCAPE:
                    thatt.isStartDrawType = 0;
                    if (thatt.tempDrawLineMeshArr.length > 0) {
                        for (i = 0; i < thatt.tempDrawLineMeshArr.length; i++) {
                            thatt.sceneman.scene.remove(thatt.tempDrawLineMeshArr[i]);
                        }
                    }
                    thatt.tempDrawLineMeshArr = [];
                    thatt.drawLineMeshArr = [];
                    thatt.drawLinePoints = [];
                    thatt.drawMeshArr = [];
                    break;
                case Keyboard.M:
                    if (thatt._selectMeshs && thatt._selectMeshs.length > 1) {
                        thatt.commonMeshs();
                    }
                    break;
                case Keyboard.L:
                    if (thatt._selectMeshs && thatt._selectMeshs.length === 1) {
                        thatt.splitMeshs();
                    }
                    break
                case Keyboard.E:
                    if (thatt.transformControls) {
                        thatt.transformControls.ControlMode = thatt.transformControls.ControlMode > 1 ? 1 : 2;
                    }
                    break;
                case Keyboard.DELETE:
                    if (thatt.tempMeshGroup) {
                        thatt.tempMeshGroup.WireFrame = false;
                        // MeshControlUtils.single.addMesh(thatt.meshs,c,thatt.sceneman.scene);
                        MeshControlUtils.single.removeMesh(thatt.meshs, thatt.tempMeshGroup, thatt.sceneman.scene);
                        // thatt.sceneman.scene.remove(thatt.tempMeshGroup);
                        thatt.tempMeshGroup = null;
                        thatt.transformControls.detach();
                    } else {
                        if (thatt._selectMeshs && thatt._selectMeshs.length > 0) {
                            for (i = 0; i < thatt._selectMeshs.length; i++) {
                                MeshControlUtils.single.removeMesh(thatt.meshs, thatt._selectMeshs[i], thatt.sceneman.scene);
                                // thatt.sceneman.scene.remove(thatt._selectMeshs[i]);
                            }
                            thatt.transformControls.detach();
                        }
                    }
                    break;
            }
        }
        this.sceneman.render.domElement.addEventListener('mousedown', onPointer3DDown);
        this.sceneman.render.domElement.addEventListener('mousemove', onPointer3DMove);
        this.sceneman.render.domElement.addEventListener('mouseup', onPointer3DUp);
        this.sceneman2.render.domElement.addEventListener('mousedown', onPointer2DDown);
        this.sceneman2.render.domElement.addEventListener('mousemove', onPointer2DMove);
        document.addEventListener('keydown', keyDown);
        document.addEventListener('keyup', keyUp);

        // this.jsonparse(jsonobject);
    }

    public changeScaleControl(num: number): void {
        if (this.transformControls) {
            this.transformControls.imgScale = num;
            console.log(num);
        }
    }

    public changeSceneControl(num: number): void {
        if (this.transformControls) {
            if (num === 0) {
                this.transformControls.ControlCamera = this.sceneman.camera;
            } else if (num === 2) {
                this.transformControls.ControlCamera = this.sceneman2.camera;
            }

        }
    }

    public changeMeshSize(arr: any[]): void {
        if (this._selectMeshs && this._selectMeshs.length > 0 && arr) {
            if (arr[0] && arr[0] > 0) {
                this._selectMeshs[0].Length = arr[0];
            }
            if (arr[1] && arr[1] > 0) {
                this._selectMeshs[0].Width = arr[1];
            }
            if (arr[2] && arr[2] > 0) {
                this._selectMeshs[0].Height = arr[2];
            }
        }
    }

    public drawBaseBIMAIMesh(type: number = 0): void {
        this.isStartDrawType = type;
        this.drawLineMeshArr = [];
        this.tempDrawLineMeshArr = [];
        BIM.viewmode = 2;
        (BIM.mgr[ConstDef.WEBGL_RENDER_MGR] as RenderMgr).changeViewMode();
    }

    dispose(): void {

    }
}