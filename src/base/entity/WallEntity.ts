import { Pool } from "@/framework/pool/Pool";
import PoolDef from "@/libs/PoolDef";
import { BufferGeometry, Material, Mesh } from "three";
import { BIMAIMesh } from "../meshcontrols/BIMAIMesh";
import EntityBase from "./EntityBase";
/**
 * @description 墙
 * @author songmy
 */
export default class WallEntity extends EntityBase
{
    constructor(){
        super();
        this._type = 'wall';
    }
    
    static create():WallEntity {
        return Pool.getItemByClass(PoolDef.WALL, WallEntity);
    }


    protected onRcover(): void {
        Pool.recover(PoolDef.WALL, this);
    }

    protected onReset():void {

    }
}