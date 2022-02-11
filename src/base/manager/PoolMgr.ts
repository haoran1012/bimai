import BIM from "@/BIM";
import { Pool } from "@/framework/pool/Pool";

/**
 * 对象池统一管理，
 */
export default class PoolMgr
{
    public static getItem(cls:IPool):any {
        let Item = Pool.getItemByClass(cls.POOL, cls) as IPoolObject;
        Item.reset();
        return Item;
    }

    public static recover(item:any) {
        Pool.recover(item.constructor.POOL, item);
    }

    public static startUp():void {
        BIM.timer.loop(2000, PoolMgr, PoolMgr.onTimer);
    }

    /** 定时清理内存池数据 */
    public static onTimer():void {
        for (let k in Pool._poolDic) {
            if ((Pool._poolDic[k] as Array<any>).length > 20) {
                (Pool._poolDic[k] as Array<any>).length = 20;
                break;
            }
        }
    }
}