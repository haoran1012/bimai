export class MeshControlconst{
    static WALL:string = 'wall';//墙
    static BEAM:string = 'beam';//梁
    static BOARD:string = 'board';//板
    static FLOOR_BOARD:string = 'floorBoard';//楼板
    static CIRCLE_PILLAR:string = 'circlePillar';//圆柱
    static SQUARE_PILLAR:string = 'aquarePillar';//方柱
    static TFCS:string='transformControls';
    static SELECTBOX:string = 'selectionBox';
    static NO_S:string='nos';//不能选中的模型前缀

    static NOS_X_TRANSLATE:string = 'nos_X_translate';
    static NOS_Y_TRANSLATE:string = 'nos_Y_translate';
    static NOS_Z_TRANSLATE:string = 'nos_Z_translate';


    static NOS_X_ROTATE:string = 'nos_X_rotate';
    static NOS_Y_ROTATE:string = 'nos_Y_rotate';
    static NOS_Z_ROTATE:string = 'nos_Z_rotate';

    static TRANSLATE_CONTROL_MODE:number = 1;
    static ROTATE_CONTROL_MODE:number = 2;

    static DRAW_Mesh_NO:number = 0;//不画模型
    static DRAW_Mesh_WALL:number = 1;//画墙
    static DRAW_Mesh_CIRCLE:number = 2;//画圆柱
    static DRAW_Mesh_RECT:number = 3;//方形柱
    static DRAW_Mesh_BEAM:number = 4;//梁
    static DRAW_Mesh_BOARD:number = 5;//楼板

    static WIRE_FRAME:string = 'wireFrame';//模型包围框命名
    static DRAW_MESH_NAME:string = 'drawMesh';//

}