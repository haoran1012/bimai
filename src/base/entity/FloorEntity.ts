import { Pool } from "@/framework/pool/Pool";
import PoolDef from "@/libs/PoolDef";
import EntityBase from "./EntityBase";

export default class FloorEntity extends EntityBase implements IStruct
{
    constructor(){
        super();
        this._type = 'floor';
    }
    
    static create():FloorEntity {
        return Pool.getItemByClass(PoolDef.FLOOR, FloorEntity);
    }

    protected onRcover(): void {
        Pool.recover(PoolDef.FLOOR, this);
    }

    protected onReset():void {

    }

}