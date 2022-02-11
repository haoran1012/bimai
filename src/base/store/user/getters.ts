import { EnterpriseInfo } from '@/base/datas/EnterpriseInfo';
import { GetterTree } from 'vuex'
import { UserState } from './state'

export const getters: GetterTree<UserState, {}> = {
  userInfo: (state) => state.userInfo, // 用户信息
  enprieList: (state) => state.enterpriseList,
  getcurrEnrieList: (state) => {
    if(state.enterpriseList && state.userInfo.chooseId !== "")
    {
      for(let i: number = 0; i < state.enterpriseList.length; i++)
      {
          let item: EnterpriseInfo = state.enterpriseList[i];
          if(item.id == state.userInfo.chooseId)
          {
            return item;
          }
      }
      
    }
  
      return new EnterpriseInfo().setDefault();

  }
}
