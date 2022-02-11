import { GetterTree } from "vuex";
import { projectState, state } from "./state";

export  const getters: GetterTree<projectState, {}> = { 
    queryProList : (state)=>{
        return state.projectInfo.projectList;
    },

    getCurrProList : (state) => {
        return state.projectInfo.projectList;
    },

    getProInfoById : (state) => (id)=>{
        console.log("get")
        let proList = state.projectInfo.projectList;

        for(let i: number = 0; i < proList.length; i++)
        {
            let item = proList[i]
            if(item && item.id == id)
            {
                return item;
            }
        }

    }
}

export default getters;