import ServiceBase from "./ServiceBase";
import ServiceEvent from "./ServiceEvent";
import ServiceFactoryBase from "./ServiceFactoryBase";

export default class ServiceManager {

    private _serviceFactory: Map<string, ServiceFactoryBase>;

    private _serviceList: Map<string, ServiceBase>;

    private static _ins: ServiceManager;
    public static get ins(): ServiceManager {
        if (this._ins == null) {
            this._ins = new ServiceManager();
        }
        return this._ins;
    }

    constructor() {

        this._serviceFactory = new Map<string, ServiceFactoryBase>();
        this._serviceList = new Map<string, ServiceBase>();
    }

    public static RegSer(type: string, classFactory: any): void {
        if (ServiceManager.ins._serviceFactory.has(type)) {
            throw new Error("已经注册过此类型的服务工厂，请勿再次注册");
        }
        ServiceManager.ins._serviceFactory.set(type, classFactory)
    }

    /**
    * 获取Service
    * @param type
    * @return
    *
    */
    public getService(type: string): ServiceBase {
        var sb: ServiceBase = null;
        if (this._serviceList.has(type)) {
            sb = this._serviceList.get(type);
        }
        else if (this._serviceFactory.has(type)) {
            var sf: ServiceFactoryBase = this._serviceFactory.get(type);
            sb = this.initService(sf);
        }
        if (sb != null) {
            if (sb.inited) {
                return sb;
            }
        }
        console.log("[ServiceManager] 有人拿到了一个空的服务对象::", type);
        return null;
    }

    private initService(sf: ServiceFactoryBase): ServiceBase {
        var sb: ServiceBase = sf.createService() as ServiceBase;
        this._serviceList.set(sb.type, sb);
        // sb.addEventListener(ServiceEvent.SUB_SERVICE_INITED, this, this.onServiceInited);
        // sb.addEventListener(ServiceEvent.SUB_SERVICE_ERROR, this, this.onServiceError);
        // sb.addEventListener(ServiceEvent.SUB_SERVICE_DISPOSED, this, this.onServiceDisposed);
        sb.serviceInit();
        return sb;
    }

    // private onServiceInited(e:ServiceEvent):void
    // {
    //     Laya.CallLater.bind(this.notifyServiceStatuChanged);
    // }

    // private onServiceError(e:ServiceEvent):void
    // {
    //     Laya.CallLater.bind(this.notifyServiceStatuChanged);
    // }

    // private onServiceDisposed(e:ServiceEvent):void
    // {
    //     Laya.CallLater.bind(this.notifyServiceStatuChanged);
    // }

    /**
     * 移除Service
     * @param type
     *
     */
    public removeService(type: string): void {
        if (this._serviceList.has(type)) {
            var sb: ServiceBase = this._serviceList.get(type);
            // sb.removeEventListener(ServiceEvent.SUB_SERVICE_INITED, this, this.onServiceInited);
            // sb.removeEventListener(ServiceEvent.SUB_SERVICE_ERROR, this, this.onServiceError);
            // sb.removeEventListener(ServiceEvent.SUB_SERVICE_DISPOSED,this, this.onServiceDisposed);
            sb.dispose();
            this._serviceList.delete(type);
            // Laya.CallLater.bind(this.notifyServiceStatuChanged);
        }
    }

    private notifyServiceStatuChanged(): void {
        // this.event(ServiceEvent.SERVICE_STATE_CHANGED);
    }
}