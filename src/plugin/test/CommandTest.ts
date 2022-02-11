export default class CommandTest implements ICommond
{
    public sd:number = 0;
    public data:number = 0;
    constructor(data:number){
        this.data = data
    }

    execute(): void {
        this.sd += this.data;
        console.log('command execute:', this.sd);
    }

    undo(): void {
        this.sd -= this.data; 
        console.log('command undo:', this.sd);
    }
}