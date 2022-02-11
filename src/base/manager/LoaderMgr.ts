import Handler from "@/framework/Utils/Handler";

export default class LoaderMgr implements IMgr
{
    private static _ins:LoaderMgr;
    static get ins():LoaderMgr {
        if(!LoaderMgr._ins){
            LoaderMgr._ins = new LoaderMgr();
        }
        return LoaderMgr._ins;
    }

    startUp(): void {
        
    }

    load(url:string, complete:Handler):void {
        console.log("loading res...");

        
        if(complete){
            complete.run();
        }
    }
    

    dispose(): void {
        
    }
}
