import ServiceBase from "@/base/server/ServiceBase";
import ServiceConst from "@/base/server/ServiceConst";
import SchemeCtrl from "@/plugin/scheme/SchemeCtrl";
import SchemeMgr from "@/plugin/scheme/SchemeMgr";

export default class SchemeService extends ServiceBase implements ISchemeService
{
    private _ctrl:SchemeCtrl;

    private _mgr:SchemeMgr;

    constructor() {
        super(ServiceConst.SCHEME_SERVICE);
        this._ctrl = new SchemeCtrl();
        this._mgr = new SchemeMgr();
    }

    protected onInit(): void {
         this.notifyServiceInited();
    }


    save(data:any):void{

    }

    protected onDispose(): void {
        this._ctrl.dispose();
        this._ctrl = null;
        this._mgr.dispose();
        this._mgr = null;
    }
}