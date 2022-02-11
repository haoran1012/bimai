import { EngenInfo } from "@/base/datas/EngenInfo"
import { ProjectInfo } from "@/base/datas/ProjectInfo"

export interface ProjectInfos{
    projectList: Array<ProjectInfo>,
    engList: Array<EngenInfo>
};

export interface projectState{
    projectInfo: ProjectInfos,
    queryProStr: string,
    queryEngStr: string,
    currSelectId: string
}

export const state: projectState = {
    // 用户信息
    projectInfo: {
        projectList : [],
        engList: []
    },

    //"conditon1&condition2&condition3"
    //condition::  condition(1) + condition(2)
    queryProStr: '',

    queryEngStr: '',

    currSelectId: ""
  }