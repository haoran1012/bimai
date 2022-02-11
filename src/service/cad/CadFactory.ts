import ServiceConst from "@/base/server/ServiceConst";
import ServiceFactoryBase from "@/base/server/ServiceFactoryBase";
import CadService from "./CadService";

export default class CadFactory extends ServiceFactoryBase
{
    constructor() {
        super(ServiceConst.CAD_SERVICE, CadService);
    }
}