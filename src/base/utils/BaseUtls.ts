import { Box3, Mesh, Vector2, Vector3 } from "three";

export default class BaseUtls {
    /**
     * 偏移
     * @param arr 
     * @param arr2 
     * @param arr3 
     */
    static getJsonOffset(arr: Vector2[], arr2: number[], arr3: number[]): void {
        for (let i = 0; i < arr.length; i++) {
            arr[i].x -= arr2[0];
            arr[i].y -= arr2[1];
        }
        if (arr3[0] > arr2[0]) {
            arr3[0] = arr2[0];
        }
        if (arr3[2] > arr2[1]) {
            arr3[2] = arr2[1];
        }
        if (arr3[1] < arr2[2]) {
            arr3[1] = arr2[2];
        }
        if (arr3[3] < arr2[3]) {
            arr3[3] = arr2[3];
        }
    }

    /**
     * 获取极值数组
     * @param arr 
     * @returns 
     */
    static getExtremum(arr: any[]): number[] {
        let minx = Infinity;
        let miny = Infinity;
        let maxx = -Infinity;
        let maxy = -Infinity;
        let fn: any;
        for (let i = 0; i < arr.length; i++) {
            fn = arr[i];
            if (fn.x < minx) {
                minx = fn.x;
            }
            if (fn.x > maxx) {
                maxx = fn.x;
            }
            if (fn.y < miny) {
                miny = fn.y;
            }
            if (fn.y > maxy) {
                maxy = fn.y;
            }
        }
        return [minx, miny, maxx, maxy, maxx - minx, maxy - miny];
    }

    /**
     * 获取三维图形的中心位置
     * @param meshs 三维图形集合
     * @returns 中心位置，当 meshs 为null 或者 length = 0 时，返回 null
     */
    static getMeshsCenter(meshs: any[]): Vector3 {
        if (meshs && meshs.length > 0) {
            let ct:Vector3 = new Vector3();
            let box = new Box3();
            for (let mesh of meshs) {
              
                box.expandByObject(mesh);
            }
            return box.getCenter(ct);
        }
        return null;
    }

}