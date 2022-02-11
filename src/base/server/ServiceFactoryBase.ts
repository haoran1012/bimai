/**
 * 服务实例工厂
 * @author songmy
 * @date 2021/4
 */
export default class ServiceFactoryBase {
    protected _type: string;

    protected _serviceClass: any;

    protected _syncInit: boolean;

    constructor(type: string, serviceClass: any, syncInit?: boolean) {
        this.init(type, serviceClass, syncInit)
    }

    protected init(type: string, serviceClass: any, syncInit: boolean = true): void {
        this._type = type;
        this._serviceClass = serviceClass;
        this._syncInit = syncInit;
    }

    /**
     * 服务类型
     */
    public get type(): string {
        return this._type;
    }

    /**
     * 创建服务
     * @returns 
     */
    public createService(): any {
        return new this._serviceClass;
    }

    /**
     * 异步创建服务（在业务调用时自动创建)
     */
    public get asyncInitService(): boolean {
        return this._syncInit;
    }
}