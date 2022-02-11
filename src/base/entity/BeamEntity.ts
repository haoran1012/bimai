import { Pool } from "@/framework/pool/Pool";
import PoolDef from "@/libs/PoolDef";
import EntityBase from "./EntityBase";

/**
 * @description 梁
 * @author songmy
 */
export default class BeamEntity extends EntityBase implements IStruct
{
    constructor(){
        super();
        this._type = 'beam';
    }

    static create():BeamEntity {
        return Pool.getItemByClass(PoolDef.BEAM, BeamEntity);
    }

    protected onRcover(): void {
        Pool.recover(PoolDef.STAIRS, this);
    }


    protected onReset():void {

    }

}