import { MutationTree } from 'vuex'
import { UserState } from './state'
import { UserMutationTypes } from './mutation-type'
import { EnterpriseInfo } from '@/base/datas/EnterpriseInfo'

export type Mutations<S = UserState> = {
  [UserMutationTypes.SET_USER_INFO](state: S, userInfo: any): void
}

export const mutations: MutationTree<UserState> & Mutations = {
  /**
   * @description: 保存用户信息
   * @author:
   */
  [UserMutationTypes.SET_USER_INFO](state: UserState, userInfo: any) {
    state.userInfo = userInfo;

    window.localStorage.setItem("token", userInfo.token);
  },

  //保存用户的企业信息
  [UserMutationTypes.SET_USER_ENTERPRISELIST](state: UserState, enterpriseList: any) {

    if (enterpriseList && Array.isArray(enterpriseList)) {
      let list: Array<EnterpriseInfo> = [];
      let len: number = enterpriseList.length;
      for(let i: number = 0; i < len; i++)
      {
        let enterInfo: EnterpriseInfo = new EnterpriseInfo();
        enterInfo.setData(enterpriseList[i]);
        list.push(enterInfo);
      }

      state.enterpriseList = list;
    }

  },

  [UserMutationTypes.SET_USER_CHOOSED_COMID](state: UserState, id: any) {
        state.userInfo.chooseId = id;
        console.log("设置成功:" + state.userInfo.chooseId);
  }
}
