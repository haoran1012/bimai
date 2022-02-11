import CommandTest from "@/plugin/test/CommandTest";

/**
 * @description 撤销/重做 命令管理
 * @author songmy
 */
export default class CommandMgr implements IMgr {
    /** 次数限制 */
    private _undoCount = -1;
    /** 撤销列表 */
    private _undoList: ICommond[];
    /** 重做列表 */
    private _redoList: ICommond[];

    constructor() {
        this._undoCount = 10;
        this._undoList = [];
        this._redoList = [];
    }

    startUp(): void {
        console.log('commandmgr start up.');
        this.execute(new CommandTest(3));
    }

    execute(cmd: ICommond): void {
        // 执行操作
        cmd.execute();

        this._undoList.push(cmd);
        // 保留最近undoCount次操作，删除最早操作
        if (this._undoCount != -1 && this._undoList.length > this._undoCount) {
            this._undoList.shift();
        }

        // 执行新操作后清空redoList，因为这些操作不能恢复了
        this._redoList = [];
    }

    /**
     * 执行撤销操作
     */
    undo(): void {
        if (this._undoList.length <= 0) {
            return;
        }

        let cmd: ICommond = this._undoList[this._undoList.length - 1];
        cmd.undo();

        this._undoList.pop();
        this._redoList.push(cmd);
    }

    /**
     * 执行重做
     */
    redo(): void {
        if (this._redoList.length <= 0) {
            return;
        }

        let cmd: ICommond = this._redoList[this._redoList.length - 1];
        cmd.execute();

        this._redoList.pop();
        this._undoList.push(cmd);
    }

    dispose(): void {
        this._redoList = null;
        this._undoList = null;
    }
}

