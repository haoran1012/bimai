import BeamEntity from "@/base/entity/BeamEntity";
import EntityBase from "@/base/entity/EntityBase";
import FloorEntity from "@/base/entity/FloorEntity";
import PillarEntity from "@/base/entity/PillarEntity";
import WallEntity from "@/base/entity/WallEntity";
import SceneMgr from "@/base/manager/SceneMgr";
import BaseUtls from "@/base/utils/BaseUtls";
import BIM from "@/BIM";
import ConstDef from "@/libs/ConstDef";
import { BufferGeometry, Color, ColorRepresentation, Group, Line, LineBasicMaterial, Vector2, Vector3 } from "three";
import jsonCfg from '@/assets/json/housetype.json'
import EntityMgr from "@/base/manager/EntityMgr";

export default class CadMgr implements IPluginMgr {


    readJson(data: any): void {
        data = jsonCfg;
        // 画图纸
        this.drawBaseMap(data);
        // 生成建筑
        this.createBuildings(data);
    }

    drawBaseMap(data: any): void {
        
    }

    drawLine(points: any[], color: number[], group: Group): void {
        let colors = new Color(color[0], color[1], color[2]); 
        let material = new LineBasicMaterial({ color: colors})
        let geometry = new BufferGeometry().setFromPoints(points);
        let line = new Line(geometry, material);
        group.add(line);
    }

    createBuildings(data: any): void {
        let group = new Group;
        let scale: number = 100;
        let hs: number[] = [];
        let infinitys: number[] = [Infinity, -Infinity, Infinity, -Infinity];
        // 高度
        hs.push(0);
        // 地板
        data.floor && this.createEntity(data.floor, ConstDef.COLOR_GREY, 'floor', infinitys, group, hs, scale);
        // 墙
        data.wall && this.createEntity(data.wall, ConstDef.COLOR_DIMGRAY, 'wall', infinitys, group, hs, scale);
        // 梁
        data.beam && this.createEntity(data.beam, ConstDef.COLOR_PINK, 'beam', infinitys, group, hs, scale);
        // 柱子
        data.pillar && this.createEntity(data.pillar, ConstDef.COLOR_SILVER, 'pillar', infinitys, group, hs, scale);


        // 算中心Y
        let h: number = 0;
        if (hs.length != 0) {
            let min = Math.min(0, ...hs);
            let max = Math.max(0, ...hs);
            h = (max - min) / 2;
        }

        let center = new Vector3((infinitys[0] + (infinitys[1] - infinitys[0]) / 2), h / scale, infinitys[2] + (infinitys[3] - infinitys[2]) / 2);
        let sceneMgr = BIM.mgr[ConstDef.SCENE_MGR] as SceneMgr;
        sceneMgr.aerial.scene.add(group);
        // 鸟瞰视图
        sceneMgr.center = center.clone();
        sceneMgr.aerial.controls.target = center.clone();
        // 正交视图 
        sceneMgr.hud.controls.target = center.clone();
        sceneMgr.hud.controls.camera.position.set(center.x, 10, center.z);

        BIM.timer.callLater(this, this.changeCamePos, [sceneMgr]);
    }

    changeCamePos(sceneMgr: SceneMgr): void {
        sceneMgr.onPointDow(ConstDef.FRONT_LEFT_TOP);
        sceneMgr.hud.controls.update();
    }

    createEntity(datas: any, color: ColorRepresentation, type: any, infinitys: number[], group: Group, hs: number[], scale: number = 100): void {
        let points: Vector2[];
        let extr: number[] = [];
        let entityMgr = BIM.mgr[ConstDef.ENTITY_MGR] as EntityMgr;
        for (let data of datas) {
            points = [];
            let values = data.value;
            hs.push(data.height + data.depth);
            for (let i = 0; i < values.length; i += 2) {
                points.push(new Vector2(values[i] / scale, values[i + 1] / scale));
            }
            extr = BaseUtls.getExtremum(points);
            BaseUtls.getJsonOffset(points, extr, infinitys);

            let entity = type == 'floor' ? FloorEntity.create() :
                type == 'wall' ? WallEntity.create() :
                    type == 'pillar' ? PillarEntity.create() :
                        type == 'beam' ? BeamEntity.create() : null;

            if (entity) {
                entity.generate(points, -data.depth / scale, data.height, color);

                entity.mesh.position.set(extr[0] + extr[4] / 2, data.depth / scale / 2 + data.height / scale, extr[1] + extr[5] / 2);
                entity.mesh.rotation.x = Math.PI / 2;

                group.add(entity.mesh);
                entityMgr.add(entity);
            }

        }
    }

    dispose(): void {

    }
}