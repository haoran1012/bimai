import { ActionTree, ActionContext } from 'vuex'
import { UserActionTypes } from './action-type'
import { UserMutationTypes } from './mutation-type'
import { UserState } from './state'
import { Mutations } from './mutations'
// import { login, requestEnpriseList } from '@/plugin/server/user'

// type AugmentedActionContext = {
//   commit<K extends keyof Mutations>(
//     key: K,
//     payload: Parameters<Mutations[K]>[1]
//   ): ReturnType<Mutations[K]>
// } & Omit<ActionContext<UserState, {}>, 'commit'>

// export interface Actions {
//   [UserActionTypes.SET_USER_INFO](
//     { commit }: AugmentedActionContext,
//     userInfo: any
//   ): void
// }

// export const actions: ActionTree<UserState, {}> & Actions = {
//   [UserActionTypes.SET_USER_INFO]({ commit }, userInfo: any) {
//     commit(UserMutationTypes.SET_USER_INFO, userInfo)
//   },
// }

export default {  
  login : ({state, commit, rootState}, userInfo)=>{     
    const { username, password } = userInfo;
    // return login(username, password).then((res)=>{
        // commit(UserMutationTypes.SET_USER_INFO, {token: res});   
    // })

    
    commit(UserMutationTypes.SET_USER_INFO, {token: "123"});

    
},

//更改选取的企业ID
changeChooseId: ({state, commit, rootState}, id)=>{
    commit(UserMutationTypes.SET_USER_CHOOSED_COMID, id);
},

//请求企业列表
requestEnpriseList: ({state, commit, rootState})=>{
    
    //  console.log(state.userInfo.token);

    // return requestEnpriseList(state.userInfo.token).then((res)=>{
            // console.table(res);
            // commit(UserMutationTypes.SET_USER_ENTERPRISELIST, res);

           
        // })

        commit(UserMutationTypes.SET_USER_ENTERPRISELIST, [{'id': '123', 'name':'账户1'}, {"id":"234","name":"账户2"}]);
        
    },

    loginOut: ({state, commit, rootState}, userInfo)=>{
        commit("change", "");
    }
}
