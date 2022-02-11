import BIM from "@/BIM";
import ConstDef from "@/libs/ConstDef";
import { Box3, BoxHelper, CylinderBufferGeometry, EdgesGeometry, LineBasicMaterial, LineSegments, Matrix4, Mesh, Vector2, Vector3 } from "three";
import MeshControlsMgr from "../manager/MeshControlsMgr";
import { MeshControlconst } from "./meshControlconst";
import { MeshControlUtils } from "./meshcontrolUtils";

export class BIMAIMesh extends Mesh{
    private _width:number;
    private _length:number;
    private _height:number;
    private _wireFrame:LineSegments;
    private _mainScale:number = 1000;
    private _lines:Vector3[];
    private _points:Vector3[];
    constructor(geomery:THREE.BufferGeometry,material:THREE.Material|THREE.Material[],iscenter:boolean=true){
        super(geomery,material);
        this.name = 'BMMesh';
        if(iscenter){
            this.geometry.center();
        }
        // if(this.geometry.userData && this.geometry.userData.hasOwnProperty('id') && this.geometry.userData.id === MeshControlconst.DRAW_MESH_NAME){
        //     this.geometry.translate(0,2*this.geometry.userData.height,0);
        // }
        let edges;
        if(geomery instanceof CylinderBufferGeometry){
            edges = new BoxHelper( this );
            this._wireFrame = new LineSegments( edges.geometry, new LineBasicMaterial( { color: 0x000000} ) );//没选中黑色  选中黄色
        }else{
            edges = new EdgesGeometry( this.geometry );
            this._wireFrame = new LineSegments( edges, new LineBasicMaterial( { color: 0x000000} ) );//没选中黑色  选中黄色
        }
        // this._wireFrame = new LineSegments( edges, new LineBasicMaterial( { color: 0x000000} ) );//没选中黑色  选中黄色
        this._wireFrame.name = MeshControlconst.WIRE_FRAME;
        this.add(this._wireFrame);
        this.wireFrameMode(0);
        // let centerrr = this.MeshCenter;
        // this.position.x = this.position.x + centerrr.x
        // this.position.y = this.position.y + centerrr.y
        // this.position.z = this.position.z + centerrr.z
        // let box = new Box3();
        // box.expandByObject(this);
        // this.position.add(new Vector3(Math.abs(box.min.x),Math.abs(box.min.y),Math.abs(box.min.z)));
        // console.log(box);
        
    }

    private wireFrameMode(type:number=0):void{
        let id = (BIM.mgr[ConstDef.MESH_CONTROL_MGR] as MeshControlsMgr).MeshMode;
        if(id === 0){
            if(type === 0){
                (this._wireFrame.material as LineBasicMaterial).color.setHex( 0x000000 );
            }else{
                (this._wireFrame.material as LineBasicMaterial).color.setHex( 0xffff00 );
            }
        }else if(id === 1 || id === 2){
            if(type === 0){
                this.remove(this._wireFrame);
            }else{
                (this._wireFrame.material as LineBasicMaterial).color.setHex( 0xffff00 );
                this.add(this._wireFrame);
            }
        }
    }

    set Lines(vecs:Vector3[]){
        this._lines = vecs;
    }
    get Lines():Vector3[]{
        return this._lines;
    }
    set Points(vecs:Vector3[]){
        this._points = vecs;
    }
    get Points():Vector3[]{
        return this._points;
    }
    set WireFrame(isadd:boolean){
        if(isadd){
            if(!this._wireFrame){
                let edges = new EdgesGeometry( this.geometry );
                this._wireFrame = new LineSegments( edges, new LineBasicMaterial( { color: 0xffff00 } ) );
                this._wireFrame.name = MeshControlconst.WIRE_FRAME;
            }
            this.wireFrameMode(1);
            // this.add(this._wireFrame);
        }else{
            if(this._wireFrame){
                this.wireFrameMode(0);
                // this.remove(this._wireFrame);
            }
        }
    }

    get Width():number{
        if(!this._width){
            if(!this.geometry.boundingBox){
                this.geometry.computeBoundingBox();
            }
            this._width= this.geometry.boundingBox.max.z - this.geometry.boundingBox.min.z;
        }
        return MeshControlUtils.single.toInt(this._width * this._mainScale);;
    }
    set Width(num:number){
        num = num/this._mainScale;
        if(MeshControlUtils.single.IsEquals(MeshControlUtils.single.toInt(this._width),num)){
            return;
        }
        if(!this.geometry.boundingBox){
            this.geometry.computeBoundingBox();
        }
        let w= this.geometry.boundingBox.max.z - this.geometry.boundingBox.min.z;
        this._width = num;
        this.scale.z = (num/w);
    }
    get Length():number{
        if(!this._length){
            if(!this.geometry.boundingBox){
                this.geometry.computeBoundingBox();
            }
            this._length= this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x;
        }
        return MeshControlUtils.single.toInt(this._length * this._mainScale);;
    }
    set Length(num:number){
        num = num/this._mainScale;
        if(MeshControlUtils.single.IsEquals(MeshControlUtils.single.toInt(this._length),num)){
            return;
        }
        if(!this.geometry.boundingBox){
            this.geometry.computeBoundingBox();
        }
        let l= this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x;
        this._length = num;
        this.scale.x = (num/l);
    }
    get Height():number{
        if(!this._height){
            if(!this.geometry.boundingBox){
                this.geometry.computeBoundingBox();
            }
            this._height= this.geometry.boundingBox.max.y - this.geometry.boundingBox.min.y;
        }
        return MeshControlUtils.single.toInt(this._height * this._mainScale);
    }
    set Height(num:number){
        num = num/this._mainScale;
        if(MeshControlUtils.single.IsEquals(MeshControlUtils.single.toInt(this._height),num)){
            return;
        }
        if(!this.geometry.boundingBox){
            this.geometry.computeBoundingBox();
        }
        let h= this.geometry.boundingBox.max.y - this.geometry.boundingBox.min.y;
        let offsetNum = num/2 -this._height/2;
        this._height = num;
        this.scale.y = num/h;
        if(this.name === MeshControlconst.FLOOR_BOARD || this.name === MeshControlconst.BEAM){
            this.position.y -= offsetNum;
        }else{
            this.position.y += offsetNum;
        }
    }
    get MeshCenter():Vector3{
        let box = new Box3();
        let vec = new Vector3();
        box.expandByObject(this);
        vec.x = (box.max.x - box.min.x)/2 + box.min.x;
        vec.y = (box.max.y - box.min.y)/2 + box.min.y;
        vec.z = (box.max.z - box.min.z)/2 + box.min.z;
        return vec;
    }
    public dispose():void{
        if(this.geometry){
            this.geometry.dispose();
        }
        for(let i=0;i<this.children.length;i++){
            console.log('geometry');
        }
    }
}