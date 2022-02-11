import { EventDispatcher } from "@/framework/events/EventDispatcher";
import ConstDef from "@/libs/ConstDef";
import { ColorRepresentation, DoubleSide, EdgesGeometry, ExtrudeBufferGeometry, ExtrudeGeometry, ExtrudeGeometryOptions, LineBasicMaterial, LineSegments, Material, Mesh, MeshPhongMaterial, MixOperation, Shape, Vector2 } from "three";
import { BIMAIMesh } from "../meshcontrols/BIMAIMesh";

export default class EntityBase extends EventDispatcher implements IStruct {
    /** 截面路径 */
    protected _points: Vector2[];
    /** 截面形状 */
    protected _shape: Shape;
    /** 拉伸长度度 */
    protected _depth: number;
    /** 离地距离 */
    protected _distance: number;
    /** 挤压体 */
    protected _geometry: ExtrudeBufferGeometry;
    /** 配置 */
    protected _config: ExtrudeGeometryOptions;
    /** 材质 */
    protected _material: Material | Material[];
    /** mesh */
    protected _mesh: BIMAIMesh;
    /** 类型 */
    protected _type: string;
    /** 是否选中 */
    protected _selected: boolean;
    /** 选中线框 */
    protected _selectBox:Mesh;

    constructor() {
        super();
        this._type = 'entity';
        this._selected = false;
    }

    get type(): string {
        return this._type;
    }

    get mesh(): BIMAIMesh {
        return this._mesh;
    }

    set mesh(value: BIMAIMesh) {
        this._mesh = value;
    }

    get selected(): boolean {
        return this._selected;
    }

    set selected(value: boolean) {
        if (value == this._selected) return;
        this._selected = value;
        this.changeSelectedState(value);
    }

    /**
     * 生成实体
     * @param points 截面坐标集合
     * @param depth  截面拉伸长度
     * @param distance 离地高度
     * @param color 颜色
     * @param config 挤压参数配置
     * @param material 材质
     */
    generate(points: Vector2[], depth: number, distance: number = 0, color: ColorRepresentation = 0xcccccc, config?: ExtrudeGeometryOptions, material?: Material | Material[]): void {
        this._points = points;
        this._depth = depth;
        this._distance = distance;
        this._config = config;
        this._material = material;
        this._shape = new Shape(this._points);
        if (!this._config) {
            this._config = {
                steps: 1,
                depth: this._depth,
                bevelEnabled: false,
            }
        }
        if (!this._material) {
            this._material = new MeshPhongMaterial({
                color: color,
                side: DoubleSide,
            });
        }
        this._geometry = new ExtrudeBufferGeometry(this._shape, this._config);
        this._mesh = new BIMAIMesh(this._geometry, this._material);
    }

    center(): void {

        this._geometry.computeBoundingBox();
        let min_x = this._geometry.boundingBox.min.x;
        let max_x = this._geometry.boundingBox.max.x;
        let min_y = this._geometry.boundingBox.min.y;
        let max_y = this._geometry.boundingBox.max.y;
    }


    changeSelectedState(value: boolean): void {
        if(!this._selectBox){
            let pmt = new MeshPhongMaterial({
                color: ConstDef.COLOR_DODGER_BLUE,
                side: DoubleSide,
                transparent: true,
                depthTest: false,
                opacity: 0.25
            })
            const edges = new EdgesGeometry(this._geometry);
            const line = new LineSegments(edges, new LineBasicMaterial({ 
                color: ConstDef.COLOR_ROYAL_BLUE, 
                depthTest: false, 
            }));
            this._selectBox = new Mesh(this._geometry, pmt);
            this._selectBox.name = 'selected_model'
            this._selectBox.add(line);
        }
        
        value ? this._mesh.add(this._selectBox) : this.mesh.remove(this._selectBox);
    }


    /** 重置 */
    reset(): void {

        this.onReset();

        this._points = null;
        this._shape = null;
        this._geometry = null;
        this._config = null;
        this._material = null;
        this._mesh = null;
    }

    recover(): void {
        this.reset();
        this.onRcover();
    }

    protected onRcover(): void {

    }

    protected onReset(): void {
        
    }
}