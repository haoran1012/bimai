export class ProjectInfo{
    //项目名称
    name: string;
    //项目代码
    code: string;
    //开发商
    developer: string;
    //设计单位
    designer: string;
    //施工单位
    organization: string;
    //楼层总数
    layerNums: number;
    //项目管理员
    adminer: string;
    //项目状态
    staus: string;

    id: string;

    constructor()
    {

    }

    public setData(obj: Object)
    {
        if(!obj){
            return;
        }

        obj.hasOwnProperty("id") && (this.id = obj["id"]);
        obj.hasOwnProperty("name") && (this.name = obj["name"]);
        obj.hasOwnProperty("code") && (this.code = obj["code"]);
        obj.hasOwnProperty("developer") && (this.developer = obj["developer"]);
        obj.hasOwnProperty("designer") && (this.designer = obj["designer"]);
        obj.hasOwnProperty("organization") && (this.organization = obj["organization"]);
        obj.hasOwnProperty("layerNums") && (this.layerNums = obj["layerNums"]);
        obj.hasOwnProperty("adminer") && (this.adminer = obj["adminer"]);
        obj.hasOwnProperty("staus") && (this.staus = obj["staus"]);
    }
}