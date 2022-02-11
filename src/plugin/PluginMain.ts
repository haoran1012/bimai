import BIM from "@/BIM";
import DebugMgr from "@/base/manager/DebugMgr";
import LoaderMgr from "@/base/manager/LoaderMgr";
import RenderMgr from "@/base/manager/RenderMgr";
import SceneMgr from "@/base/manager/SceneMgr";
import { UIMgr } from "@/base/manager/UIMgr";
import Handler from "@/framework/utils/Handler";
import ConstDef from "@/libs/ConstDef";
import TestMod from "./test/TestMod";
import MeshControlsMgr from "@/base/manager/MeshControlsMgr";
import PoolMgr from "@/base/manager/PoolMgr";
import { Mouse } from "@/framework/utils/Mouse";
import CallLater from "@/framework/utils/CallLater";
import { Timer } from "@/framework/utils/Timer";
import { KeyBoardManager } from "@/framework/events/KeyBoardManager";
import Service from "@/service/Service";
import EntityMgr from "@/base/manager/EntityMgr";
import CommandMgr from "@/base/manager/CommandMgr";

/*
 * @Description: 插件入口
 * @Author: songmy
 * @Date: 2022-01-04 16:18:21
 * @LastEditTime: 2022-01-05 14:04:45
 * @LastEditors: 名字
 */
export default class PluginMain {

    constructor() {
        console.log('plugin main init');
        // 1.加载资源
        LoaderMgr.ins.load("", Handler.create(this, this.onAllLoad));
    }

    onAllLoad(): void {
        console.log("on res allload");

        // 初始化组件
        this.initMgr();
        // 鼠标样式
        Mouse.__init__();
        // 键盘管理
        KeyBoardManager.__init__();
        // 初始化服务
        Service.__init__();

    }

    /** 初始化组件 */
    initMgr(): void {
        console.log("init plugin");
        // 调试管理器
        BIM.mgr[ConstDef.DEBUG_MGR] = new DebugMgr();
        // 场景管理器
        BIM.mgr[ConstDef.SCENE_MGR] = new SceneMgr();
        // 渲染管理器
        BIM.mgr[ConstDef.WEBGL_RENDER_MGR] = new RenderMgr();
        // UI管理器
        BIM.mgr[ConstDef.UI_MGR] = new UIMgr();
        // 模型控制器
        BIM.mgr[ConstDef.MESH_CONTROL_MGR] = new MeshControlsMgr();
        // 实体管理器
        BIM.mgr[ConstDef.ENTITY_MGR] = new EntityMgr();
        // 命令管理
        BIM.mgr[ConstDef.COMMAND_MGR] = new CommandMgr();

    }

    /** 启动功能 */
    startFunc(): void {
        console.log("start function");
        // 启动管理器
        BIM.startUp();
        // 添加窗口尺寸变化监听
        window.addEventListener('resize', () => this.onWindowResize());
        // 启动帧循环
        this.startRenderLoop();
        // 进入测试模块
        this.enterTest();

        PoolMgr.startUp();
    }

    /** 渲染循环 */
    startRenderLoop(): void {

        // 循环
        CallLater.I._update();
        BIM.systemTimer._update();
        BIM.timer._update();
        // 监测
        let stats = (BIM.mgr[ConstDef.DEBUG_MGR] as DebugMgr).stats;
        stats.update();
        // 渲染
        let renderMgr = (BIM.mgr[ConstDef.WEBGL_RENDER_MGR] as RenderMgr);
        renderMgr.render();
        
        // 动画帧
        requestAnimationFrame(() => this.startRenderLoop());
    }

    /** 窗口尺寸变化 */
    onWindowResize(): void {
        console.log('windows resize');
        let mgr = BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr;
        mgr.onResize();
    }

    /** 测试代码功能模块 */
    enterTest(): void {
        console.log("enter test mod");
        TestMod.ins.startUp();
    }
}