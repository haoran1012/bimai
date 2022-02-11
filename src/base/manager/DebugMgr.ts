
import Stats from "three/examples/jsm/libs/stats.module"
import BIM from "../../BIM";
/*
 * @Description: 调试管理器
 * @Author: songmy
 * @Date: 2022-01-04 18:20:17
 * @LastEditTime: 2022-01-05 14:00:35
 * @LastEditors: 名字
 */
export default class DebugMgr implements IMgr {
    private _stats: Stats;
    constructor() {

    }

    startUp(): void {
        console.log('debug manager startup');
        this._stats = Stats();

        this._stats.dom.style.position = "fixed";
        this._stats.dom.style.left = "280px";
        this._stats.dom.style.bottom = "4px"; 
        this._stats.dom.style.top = "auto";

        document.body.appendChild(this._stats.dom);
    }

    get stats():Stats {
        return this._stats;
    }

    dispose(): void {
        document.body.removeChild(this._stats.dom);
        this._stats = null;
    }
}