
/* 个人账户下的企业信息 */
export class EnterpriseInfo{

    public id: string;

    //名称
    public name: string;

    public linkName: string;

    //手机号码
    public phone: string;

    //地址
    public detailAddress: string;

    //联系方式
    public contact: string;

    //icon
    public icon: string;

    public businessLicense: string;

    public sort: number;

    public isOwner: boolean;

    private _default: {} = null;

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
        obj.hasOwnProperty("linkName") && (this.linkName = obj["linkName"]);
        obj.hasOwnProperty("phone") && (this.phone = obj["phone"]);
        obj.hasOwnProperty("detailAddress") && (this.detailAddress = obj["detailAddress"]);
        obj.hasOwnProperty("contact") && (this.contact = obj["contact"]);
        obj.hasOwnProperty("icon") && (this.icon = obj["icon"]);
        obj.hasOwnProperty("businessLicense") && (this.businessLicense = obj["businessLicense"]);
        obj.hasOwnProperty("sort") && (this.sort = obj["sort"]);
        obj.hasOwnProperty("isOwner") && (this.isOwner = obj["isOwner"]);
    }

    public setDefault(): EnterpriseInfo
    {
        if(!this._default)
        {
            this._default = {"id":"0", "name": "default"};
            this.setData(this._default);
        }    

        return this;
    }
}