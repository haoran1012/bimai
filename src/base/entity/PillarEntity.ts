import { Pool } from "@/framework/pool/Pool";
import PoolDef from "@/libs/PoolDef";
import { BufferGeometry, Material } from "three";
import { BIMAIMesh } from "../meshcontrols/BIMAIMesh";
import EntityBase from "./EntityBase";

/**
 * @description 柱子
 * @author songmy
 */
export default class PillarEntity extends EntityBase implements IStruct
{
   
    constructor(){
        super();
        this._type = 'pillar';
    }


    static create():PillarEntity {
        return Pool.getItemByClass(PoolDef.PILLAR, PillarEntity);
    }

    protected onRcover(): void {
        Pool.recover(PoolDef.STAIRS, this);
    }

    protected onReset():void {

    }

}