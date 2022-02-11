
import BIM from "../../BIM";
import leftPanel from "@/plugin/views/leftPanel/index.vue";
import { Layer } from '@/plugin/views/base/Layer';
import topBar from '@/plugin/views/topBar/index.vue';
import bottomBar from '@/plugin/views/bottomBar/index.vue'
import hud from '@/plugin/views/hud/Index.vue';
import indicator from '@/plugin/views/indicator/Index.vue';
import topSideBar from '@/plugin/views/TopSideBar/index.vue'
import rightPanel from '@/plugin/views/rightPanel/index.vue'

export class UIMgr implements IMgr {

    private _uiLayer: Layer;

    public get uiLayer(): Layer {
        return this._uiLayer;
    }

    constructor() {
        this.init();
    }

    init(): void {
        this._uiLayer = new Layer("uiLayer");

        this._uiLayer.element.oncontextmenu = function(){
            return false;
        };
        //3个栏
        this._uiLayer.appendVueComponent(topBar);
        this._uiLayer.appendVueComponent(leftPanel);
        this._uiLayer.appendVueComponent(topSideBar);
        this._uiLayer.appendVueComponent(rightPanel);
        this._uiLayer.appendVueComponent(bottomBar);
        this._uiLayer.appendVueComponent(hud);
        this._uiLayer.appendVueComponent(indicator);
    }

    startUp(): void {

        BIM.container.appendChild(this._uiLayer.element);
    }

    dispose(): void {

    }

}