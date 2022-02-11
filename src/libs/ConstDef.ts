/*
 * @Description: 
 * @Author: songmy
 * @Date: 2022-01-04 18:14:26
 * @LastEditTime: 2022-01-05 13:55:58
 * @LastEditors: 名字
 */
/** mgr管理器类型定义 */
export default class ConstDef {
    /** 调试管理器 */
    static readonly DEBUG_MGR: number = 0;
    /** 场景管理器 */
    static readonly SCENE_MGR: number = 1;
     /** 渲染管理器：放倒数第二位 */
     static readonly WEBGL_RENDER_MGR = 2;
    /** UI管理器*/
    static readonly UI_MGR: number = 3;
    /** 物件管理器*/
    static readonly MESH_CONTROL_MGR: number = 4;
    /** 实体管理 */
    static readonly ENTITY_MGR: number = 5;
    /** 命令管理 */
    static readonly COMMAND_MGR:number = 6;
    /** mgr数量：放倒数第一位 */
    static readonly MGR_SIZE = 7;

    /** 平面宽度 */
    static readonly PLANE_WIDTH = 500;
    /** 平面长度 */
    static readonly PLANE_HEIGTH = 500;

    // 面   
    static readonly RIGHT: number = 0;
    static readonly LEFT: number = 1;
    static readonly TOP: number = 2;
    static readonly BOTTOM: number = 3;
    static readonly FRONT: number = 4;
    static readonly BACK: number = 5;
    // 顶点
    static readonly FRONT_RIGHT_TOP: number = 6;
    static readonly FRONT_RIGHT_BOTTOM: number = 7;
    static readonly FRONT_LEFT_TOP: number = 8;
    static readonly FRONT_LEFT_BOTTOM: number = 9;
    static readonly BACK_RIGHT_TOP: number = 10;
    static readonly BACK_RIGHT_BOTTOM: number = 11;
    static readonly BACK_LEFT_TOP: number = 12;
    static readonly BACK_LFET_BORROM: number = 13;
    // 边
    static readonly EDGE_TOP_FRONE: number = 14;
    static readonly EDGE_TOP_RIGHT: number = 15;
    static readonly EDGE_TOP_BACK: number = 16;
    static readonly EDGE_TOP_LEFT: number = 17;
    static readonly EDGE_MF_LEFT: number = 18;
    static readonly EDGE_MF_RIGHT: number = 19;
    static readonly EDGE_MB_RIGHT: number = 20;
    static readonly EDGE_MB_LEFT: number = 21;
    static readonly EDGE_BOTTOM_FRONE: number = 22;
    static readonly EDGE_BOTTOM_RIGHT: number = 23;
    static readonly EDGE_BOTTOM_BACK: number = 24;
    static readonly EDGE_BOTTOM_LEFT: number = 25;


    // 颜色
    /** 纯白 */
    static readonly COLOR_WHITE = 0xffffff;
    /** 雪白 */
    static readonly COLOR_SNOW = 0xfffafa;
    /** 灰色 */
    static readonly COLOR_GREY = 0xbebebe;
    /** 浅灰色 */
    static readonly COLOR_LIGHT_GREY = 0xd3d3d3;
    /** 浅灰色 */
    static readonly COLOR_GAINSBPRO = 0xdcdcdc;
    /** 银灰色 */
    static readonly COLOR_SILVER = 0xc0c0c0;
    /** 暗灰色 */
    static readonly COLOR_DIMGRAY = 0x696969;
    /** 蔚蓝色 */
    static readonly COLOR_AZURE = 0xf0ffff;
    /** 淡紫色 */
    static readonly COLOR_LAVENDER = 0xe6e6fa;
    /** 皇家蓝 */
    static readonly COLOR_ROYAL_BLUE = 0x4169e1;
    /** 道奇蓝 */
    static readonly COLOR_DODGER_BLUE = 0x1e90ff;
    /** 天空蓝 */
    static readonly COLOR_SKY_BLUE = 0x87ceeb;
    /** 粉红 */
    static readonly COLOR_PINK = 0xffc0cb;
    /** 深青色 */
    static readonly COLOR_DARK_CYAN = 0x008b8b;
    /** 纯绿 */
    static readonly COLOR_GREEN = 0x008000;
    /** 橘色 */
    static readonly COLOR_ORANGE = 0xffa500;
    /** 橙红色 */
    static readonly COLOR_ORANGE_RED = 0xff4500;
}

