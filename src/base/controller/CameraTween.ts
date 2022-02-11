import { Easing, Tween } from "@tweenjs/tween.js";
import { Vector3 } from "three";

export default class CameraTween {

    static animateCamera(camera:any, controls:any, oldP:Vector3, oldT:Vector3, newP:Vector3, newT:Vector3, time:number, callBack:Function) {
        if (Tween) {
            var tween = new Tween({
                x1: oldP.x, // 相机x
                y1: oldP.y, // 相机y
                z1: oldP.z, // 相机z
                x2: oldT.x, // 控制点的中心点x
                y2: oldT.y, // 控制点的中心点y
                z2: oldT.z, // 控制点的中心点z
            });
            tween.to(
                {
                    x1: newP.x,
                    y1: newP.y,
                    z1: newP.z,
                    x2: newT.x,
                    y2: newT.y,
                    z2: newT.z,
                },
                time
            );
            tween.onUpdate(
                function () {
                    // console.log("tween object:",this._object.x1, this._object.y1, this._object.z1, this._object.x2, this._object.y2, this._object.z2)
                    // console.log("tween start:",this._valuesStart.x1, this._valuesStart.y1, this._valuesStart.z1, this._valuesStart.x2, this._valuesStart.y2, this._valuesStart.z2)
                    // console.log("tween end:",this._valuesEnd.x1, this._valuesEnd.y1, this._valuesEnd.z1, this._valuesEnd.x2, this._valuesEnd.y2, this._valuesEnd.z2)
                    camera.position.x = this._object.x1;
                    camera.position.y = this._object.y1;
                    camera.position.z = this._object.z1;
                    controls.target.x = this._object.x2;
                    controls.target.y = this._object.y2;
                    controls.target.z = this._object.z2;
                    controls.update();
                }
            );
            tween.onComplete(function () {
                controls.enabled = true;
                callBack && callBack();
            });
            tween.easing(Easing.Linear.None);
            tween.start(undefined);
        }
    }
}
