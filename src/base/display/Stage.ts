import { Object3D, Scene } from "three";
import EntityMgr from "../manager/EntityMgr";

/**
 * @description 舞台场景
 * @author songmy
 */
export default class Stage extends Scene
{


    add(...object: Object3D[]) {
        super.add(...object);
        // EntityMgr.add(...object)
        return this;
    }
}