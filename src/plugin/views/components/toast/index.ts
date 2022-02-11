import { createVNode, render } from "vue";
// import { Layer } from "../../base/Layer"
import toast from "./components/index.vue"


/////后面优化吧
export class ToastManager{

    constructor()
    {

    }

    show(message: string)
    {
        // console.log("toastman")

        const dom = document.getElementById("app");

        const newDom = document.createElement("div");
    
        const virdom = createVNode(toast, {message: message});
        render(virdom, newDom);
    
        dom.appendChild(newDom);
        
        if(!dom)
        {
            return;
        }

        setTimeout((dom, newdom)=>{
            // console.log("销毁")
            dom.removeChild(newDom);
        }, 3000, dom, newDom)
    }
} 

export const ToastManagerInstace = new ToastManager();