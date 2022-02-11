

import { Module } from "vuex";
import { rootState } from "..";
import { projectState, state } from "./state";
import { mutations } from "./mutations";
// import actions from "./actions"
import getters from "./getters";

export const project: Module<projectState, rootState> = {
    namespaced: true,
    state,
    mutations,
    // actions,
    getters,
}