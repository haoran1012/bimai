
import messages from "@/bimai_plugin/components/common/Message.vue"
import { Layer } from "./Layer";

export class MessageListMgr{
    private static _instance: MessageListMgr;

    private _msgList: Array<Layer>;

    constructor()
    {
        this._msgList = [];
    }

    public static get instance(): MessageListMgr
    {
        if(!this._instance)
        {
            this._instance = new MessageListMgr();
        }

        return this._instance;
    }

    public showMessage(msg: string = "我是提示框")
    {
        // let message = Plugin.instance.uiMgr.uiLayer.appendVueComponent(messages, {message: msg + this._msgList.length});
        // this._msgList.push(message);

        this.resetTop();
    }

    private resetTop()
    {
        let minTop: number = 10;
        
        let len: number = this._msgList.length;
        for(let i: number = 0; i < len; i++)
        {
            let mes: Layer = this._msgList[i];
            let currpos: number = (50 - i * 2);
            currpos < minTop && (currpos = minTop);
            mes.element.setAttribute("top", currpos.toString());
        }
    }
}