
import { createVNode, DefineComponent, render, VNode } from "vue";

export class Layer{
    
    //layer层  使用统一的layer样式
    public element: HTMLElement;

    public id: string;

    constructor(id: string)
    {
        this.element = document.createElement("div");   
        this.element.id = id;

        this.init();
    } 

    protected init(){
        this.element.className = 'layer';
    }

    public appendHTMLElement(node: HTMLElement)
    {
        this.element.appendChild(node);
    }

    public appendVueComponent(node: DefineComponent<{}, {}, any>,  params: {} = {}, id: string = ""): Layer
    {  

        let group: Layer = new Layer(id);
        group.element.className = "group";
       
        let vnode: VNode = createVNode(node, params);
        render(vnode, group.element); 


        this.appendHTMLElement(group.element);

        return group;
    }

    // public removeHTMLEle

    public removeChild(node: Layer )
    {
        this.element.removeChild(node.element);
    }

    // public removeVueComponent(): void
    // {
    //     this.element.removeChild()
    // }

}