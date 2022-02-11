import { Box3, Box3Helper, BoxHelper, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, Vector3 } from "three";
import { MeshControlconst } from "./meshControlconst";

export class BIMAIGroup extends Group{
    private _width:number;
    private _length:number;
    private _height:number;
    private _wireFrame:LineSegments;
    constructor(){
        super();
        this.name = 'BMGroup';
    }

    set WireFrame(isadd:boolean){
        if(isadd){
            if(!this._wireFrame){
                let edges = new BoxHelper( this );
                this._wireFrame = new LineSegments( edges.geometry, new LineBasicMaterial( { color: 0xffff00 } ) );
                this._wireFrame.name = MeshControlconst.WIRE_FRAME;
            }
            this.add(this._wireFrame);
        }else{
            if(this._wireFrame){
                this.remove(this._wireFrame);
            }
        }
    }

    get Width():number{
        if(!this._width){
            let box = new Box3();
            box.expandByObject(this);
            this._width= box.max.z - box.min.z;
        }
        return this._width;
    }
    set Width(num:number){
        let box = new Box3();
        box.expandByObject(this);
        let w= box.max.z - box.min.z;
        this._width = num;
        this.scale.setZ(num/w);
    }
    get Length():number{
        if(!this._length){
            let box = new Box3();
            box.expandByObject(this);
            this._length= box.max.x - box.min.x;
        }
        return this._length;
    }
    set Length(num:number){
        let box = new Box3();
        box.expandByObject(this);
        let l= box.max.x - box.min.x;
        this._length = num;
        this.scale.setX(num/l);
    }
    get Height():number{
        if(!this._height){
            let box = new Box3();
            box.expandByObject(this);
            this._height= box.max.y - box.min.y;
        }
        return this._height;
    }
    set Height(num:number){
        let box = new Box3();
        box.expandByObject(this);
        let h= box.max.y - box.min.y;
        this._height = num;
        this.scale.setY(num/h);
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

    public updateWireFrame(force : boolean = true):void{
        if(force){
            if(this._wireFrame){
                this.remove(this._wireFrame);
            }
            let edges = new BoxHelper( this );
            this._wireFrame = new LineSegments( edges.geometry, new LineBasicMaterial( { color: 0xffff00 } ) );
        }
    }

    public updateMatrixWorld(force : boolean):void{
        super.updateMatrixWorld(force);
        // this._wireFrame.setFromObject(this);
    }

    public dispose():void{
        if(this._wireFrame){
            this._wireFrame.geometry.dispose();
        }
        // for(let i=0;i<this.children.length;i++){
        //     console.log('geometry');
        // }
    }
}