import ServiceBase from "@/base/server/ServiceBase";
import ServiceConst from "@/base/server/ServiceConst";
import CadCtrl from "@/plugin/cad/CadCtrl";
import CadMgr from "@/plugin/cad/CadMgr";

export default class CadService extends ServiceBase implements ICadService
{

    private _ctrl:CadCtrl;

    private _mgr:CadMgr;

    constructor() {
        super(ServiceConst.CAD_SERVICE);

        this._ctrl = new CadCtrl();
        this._mgr = new CadMgr();
    }

    protected onInit(): void {
        this.notifyServiceInited();
    }

    readJson(data:any):void{
        this._mgr.readJson(data);
    }

    protected onDispose(): void {
        this._mgr.dispose();
        this._mgr = null;
        this._ctrl.dispose();
        this._ctrl = null;
    }
}