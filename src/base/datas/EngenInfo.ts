export class EngenInfo{
    //项目名称
    name: string;
    //项目代码
    code: string;
    //time
    timetap: string;
    //图片
    url: string;
    //是否锁定
    isLock: boolean;

    id: string;

    proId: string;

    constructor()
    {

    }

    public setData(obj: Object)
    {
        if(!obj){
            return;
        }

        obj.hasOwnProperty("id") && (this.name = obj["name"]);
        obj.hasOwnProperty("name") && (this.name = obj["name"]);
        obj.hasOwnProperty("code") && (this.code = obj["code"]);
        obj.hasOwnProperty("timetap") && (this.timetap = obj["timetap"]);
        obj.hasOwnProperty("url") && (this.url = obj["url"]);
        obj.hasOwnProperty("isLock") && (this.isLock = obj["isLock"]);
        obj.hasOwnProperty("proId") && (this.isLock = obj["proId"]);
    }
}