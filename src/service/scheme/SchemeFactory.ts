import ServiceConst from "@/base/server/ServiceConst";
import ServiceFactoryBase from "@/base/server/ServiceFactoryBase";
import SchemeService from "./SchemeService";

export default class SchemeFactory extends ServiceFactoryBase
{
    constructor() {
        super(ServiceConst.SCHEME_SERVICE, SchemeService);
    }
}