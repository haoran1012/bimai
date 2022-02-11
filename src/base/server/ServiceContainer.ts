import ServiceBase from "./ServiceBase";
import ServiceConst from "./ServiceConst";
import ServiceManager from "./ServiceManager";

/**
 * @description 服务容器 ServiceContiner
 * @author songmy
 */
export default class SC {

    private _scheme: any;

    private _cad: any;

    private static _ins: SC = null;
    private static get ins(): SC {
        if (this._ins == null) {
            this._ins = new SC();
        }
        return this._ins;
    }

    /**
    * 是否存在服务<br>
    * @param type
    * @return
    *
    */
    static hasService(type: string): boolean {
        return ServiceManager.ins.getService(type) != null;
    }

    /**
     * 获取服务
     * @param type 
     * @returns 
     */
    private tryGetService(type: string): ServiceBase {
        var service: ServiceBase = ServiceManager.ins.getService(type);
        if (service == null) {
            throw Error("服务获取失败:" + type);
        }
        return service;
    }

    /**
     * cad服务
     */
    static get cad(): ICadService {
        if (SC.ins._cad == null) {
            SC.ins._cad = SC.ins.tryGetService(ServiceConst.CAD_SERVICE);
        }
        return SC.ins._cad;
    }

    /**
     * 方案版本服务
     */
    public static get scheme(): ISchemeService {
        if (SC.ins._scheme == null) {
            SC.ins._scheme = SC.ins.tryGetService(ServiceConst.MAIN_VIEW_SERVICE);
        }
        return SC.ins._scheme;
    }


}