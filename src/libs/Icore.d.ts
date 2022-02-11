
interface IDispose {
    /** 数据销毁 */
    dispose():void;
}

interface IPluginMgr extends IDispose{

}

interface IPluginCtrl extends IDispose{

}

/** 启动 */
interface IStartUp {
    /** 启动 */
    startUp():void;
}

interface IMgr extends IDispose, IStartUp {
    
}

interface ITab {
    path:string,
    title:string,
}

interface IPlugin {
    /** 初始化 */
    init(root:HTMLElement, hud:HTMLElement):void;

}


/** 受对象池管理对象的接口 */
interface IPoolObject {
    /** 重置对象 */
    reset():void;
}
interface IPool {
    new ():IPoolObject;
    /** 池子类型定义 */
    readonly POOL:string;
}
/** 结构 */
interface IStruct {
   
    /** 重置 */
    reset():void;
    /** 回收 */
    recover():void;
}

interface IMod {
    init():void;
}

/** 撤销重做命令 */
interface ICommond {
    /** 执行命令和重做 */
    execute(): void;
    /** 执行撤销操作 */
    undo(): void;
}