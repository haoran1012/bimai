import { Pool } from "@/framework/pool/Pool";
import PoolDef from "@/libs/PoolDef";
import { BufferGeometry, Material } from "three";
import { BIMAIMesh } from "../meshcontrols/BIMAIMesh";
import EntityBase from "./EntityBase";
/**
 * @description 楼梯
 * @author songmy
 */
export default class StairsEntity extends EntityBase implements IStruct
{
    constructor(){
        super();
        this._type = 'stairs';
    }
    
    static create():StairsEntity {
        return Pool.getItemByClass(PoolDef.STAIRS, StairsEntity);
    }

    protected onRcover(): void {
        Pool.recover(PoolDef.STAIRS, this);
    }

    protected onReset():void {

    }

}