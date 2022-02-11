
///简单的事件塔
export default class EventTower{
    //
    private _events: Map<string, Array<Function>>;

     constructor()
     {
        this.init();
     }


     private init()
     {
         this._events = new Map<string, Array<Function>>();
        //  var e: Event = new Event();
     }

     public removeAddListen(type: string, callBack: Function)
     {
        if(!this._events)
        {
            return;
        }

        let lis: Array<Function> = this._events.get(type);
        if(!lis || lis.length== 0)
        {
           return;
        }
        else
        {
            for(let i: number = 0; i < lis.length; i++)
            {
                let curr: Function = lis[i];
                if(curr == callBack)
                {
                    lis.splice(i, 1);
                }
            }
        }
     }

     public addListenEvent(type: string, callBack: Function)
     {
        if(!this._events)
        {
            return;
        }

        let lis: Array<Function> = this._events.get(type);
        if(!lis)
        {
            lis = [callBack];
            this._events.set(type, lis);
        }
        else
        {
            // let isHas: boolean = 
            let lisLen: number = lis.length;
            for(let i: number = 0; i < lisLen; i++)
            {
                let curr: Function = lis[i];
                if(curr == callBack)
                {
                    lis[i] = curr;
                }
            }
        }
     }

     public hasListens(): boolean
     {
        return false;
     }

    
     public dispatchEvent(type: string, options: any)
     {
        if(!this._events)
        {
            return;
        }

        let lis: Array<Function> = this._events.get(type);
        if(!lis || lis.length <= 0)
        {
            return;
        }

        let len: number = lis.length;
        for(let i: number = 0; i < len; i++)
        {
            let curr: Function = lis[i];
            curr(options);
        }
     }

}