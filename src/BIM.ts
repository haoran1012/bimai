import ConstDef from "@/libs/ConstDef";
import PluginMain from "@/plugin/PluginMain";
import { EventDispatcher } from "@/framework/events/EventDispatcher";
import { LocalStorage } from "@/framework/net/LocalStorage";
import { Timer } from "@/framework/utils/Timer";

export default class BIM {
    /** 软件版本 */
    static version: string = 'v1';
    /** 视图模式：0 默认轨道控制器 1 漫游 2 正交模式*/
    static viewmode: number;
    /** 模块管理 */
    static mgr: Array<IMgr>;
    /** 主场景的根容器 */
    static container: HTMLElement;
    /** 视图层的根容器 */
    static hud: HTMLElement;
    /** 指示器的根容器 */
    static indicator: HTMLElement;
    /** 主入口 */
    static main: PluginMain;
    /** 时钟 */
    static timer: Timer;
    /** 系统时钟 */
    static systemTimer: Timer;
    /** 是否支持本地数据存储 */
    static supportLocalStorage: boolean;
    /** 全局事件派发 */
    static readonly ED:EventDispatcher = new EventDispatcher();;

    static init(): void {
        console.log('BIM init');
        // 初始化管理器
        BIM.mgr = new Array<IMgr>(ConstDef.MGR_SIZE);
        // 本地数据存储
        BIM.supportLocalStorage = LocalStorage.__init__();
        // 时钟：系统用 + 逻辑用
        BIM.systemTimer = new Timer(false);
        BIM.timer = new Timer(false);
        // 初始化核心
        BIM.main = new PluginMain();
    }

    static startUp(): void {
        for (let i = 0; i < BIM.mgr.length; ++i) {
            BIM.mgr[i].startUp();
        }
    }
}