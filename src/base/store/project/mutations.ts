import { ProjectInfo } from "@/base/datas/ProjectInfo";
import { MutationTree } from "vuex";
import { projectState } from "./state";
import { ProMutationTypes } from "./type";

export type Mutations<S = projectState> = {
  //   [UserMutationTypes.SET_USER_INFO](state: S, userInfo: any): void
};

export const mutations: MutationTree<projectState> & Mutations = {
  /**
   * @description:
   */
  [ProMutationTypes.SET_PROJECT_LIST](state: projectState, prolist: any) {
    if (prolist && Array.isArray(prolist)) {
      let list: Array<ProjectInfo> = [];
      let len: number = prolist.length;
      for (let i: number = 0; i < len; i++) {
        let enterInfo: ProjectInfo = new ProjectInfo();
        enterInfo.setData(prolist[i]);
        list.push(enterInfo);
      }

      state.projectInfo.projectList = list;

      console.table(list);
    }
  },

  /**
   * 更改项目列表页的选中项目
   * @description:
   */
  [ProMutationTypes.SAVE_SELECT_PRO_ID](state: projectState, id: any) {
    console.log("id:" + id);
    state.currSelectId = id;
  },

  /**
   * 更改项目列表页的筛选字符串
   * @description:
   */
  [ProMutationTypes.SET_PROJECT_QUERYSTR](state: projectState, query: any) {
    console.log("query:" + query);
    state.queryProStr = query;
  },

  /**
   * 更改项目列表页的工程筛选字符串
   * @description:
   */
  [ProMutationTypes.SET_ENGEN_QUERYSTR](state: projectState, query: any) {
    console.log("query:" + query);
    state.queryEngStr = query;
  },
};
