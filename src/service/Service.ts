import ServiceConst from "@/base/server/ServiceConst";
import ServiceManager from "@/base/server/ServiceManager";
import CadFactory from "./cad/CadFactory";
import SchemeFactory from "./scheme/SchemeFactory";

export default class Service
{

    static __init__(): void {
        ServiceManager.RegSer(ServiceConst.CAD_SERVICE, new CadFactory());
        ServiceManager.RegSer(ServiceConst.SCHEME_SERVICE, new SchemeFactory());
    }
}