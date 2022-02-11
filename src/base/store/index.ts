import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { user } from './user';
import { project } from './project';
import { UserState } from './user/state';
import { projectState } from './project/state';

//注册一个顶级的rootState
export interface rootState{

}

//注册所有的数据
export interface AllStateTypes extends rootState{
    user: UserState,
    project: projectState
}


// inject一下
export const key: InjectionKey<Store<rootState>> = Symbol();

export const store = createStore({
  modules: {
    user,
    project
  }
})

export  function useStore<T=AllStateTypes>()
{
    return baseUseStore<T>(key);
}
