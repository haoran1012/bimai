import EventDef from "@/libs/EventDef";

export default class DrawLayerCtrl implements IStartUp
{
    private _canvas:HTMLCanvasElement;
    private _ctx:CanvasRenderingContext2D;

    constructor(canvas:HTMLCanvasElement) {
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");
    }

    startUp(): void {
        
 
    }

    private onCanvasClick(evt:MouseEvent):void {
        console.log('mouse click')
    }

    private onCanvasDown(evt:MouseEvent):void {
        console.log('mouse down')
    }

    private onCanvasUp(evt:MouseEvent):void {
        console.log('mouse up')
    }

    private onCanvasMove(evt:MouseEvent):void {
        console.log('mouse move')
    }
}