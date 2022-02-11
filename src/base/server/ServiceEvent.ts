export default class ServiceEvent 
{

    public static readonly SUB_SERVICE_ERROR:string = "sub_service_error";
        
    public static readonly SUB_SERVICE_INITED:string = "sub_service_inited";

    public static readonly SUB_SERVICE_DISPOSED:string = "sub_service_disposed";
    
    public static readonly SERVICE_STATE_CHANGED:string = "serviceStateChanegd";

    private _serviceType:string;

    constructor(type:string, serviceType:string = null){
        
        this._serviceType = serviceType
    }

    public get serviceType():string
    {
        return this._serviceType;
    }
}