import { Object3D } from "three";
import EntityBase from "../entity/EntityBase";
import WallEntity from "../entity/WallEntity";

export default class EntityMgr implements IMgr {
    /** 项目的根节点 */
    private _root:any = {};

    constructor() {

    }

    add(entity:EntityBase):void {
        if(!this._root[entity.type]){
            this._root[entity.type] = {}
        }
        this._root[entity.type][entity.mesh.uuid] = entity;
    }

    remove(type:string, uid:string):void {
        this._root[type][uid] = null;
    }

    getEntityByType(type:string):EntityBase[] {
        let entitys:EntityBase[] = [];
        for(let entity in this._root[type]){
            entitys.push(this._root[type][entity]);
        }
        return entitys;
    }


    startUp(): void {
        console.log('start up entity mgr');
    }

    dispose(): void {
        this._root = null;
    }
}