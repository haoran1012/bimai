import { EventDispatcher } from "@/framework/events/EventDispatcher";

/**
 * @description 根节点, 
 * @author songmy
 */
export default class Node extends EventDispatcher
{
    protected static ARRAY_EMPTY: any[] = [];

    private _bits: number = 0;
    /** 子对象集合 */
    _children: any[] = Node.ARRAY_EMPTY;

    

}