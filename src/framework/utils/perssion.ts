import { store, useStore } from "@/base/store";

//是否登录了
export function isLogin(): boolean
{
    // let token: string =    // window.localStorage.getItem('token');

    console.log("sdfasfs")
    console.log(store.getters["user/userInfo"])

    return store.getters["user/userInfo"] && store.getters["user/userInfo"].token && store.getters["user/userInfo"].token != "";
}

//是否选择了企业登录
export function isChooseId(): boolean
{
    let store = useStore();
    let isChoose: boolean = false;

    if(store.getters["user/userInfo"] && store.getters["user/userInfo"].chooseId && store.getters["user/userInfo"].chooseId != "")
    {
        isChoose = true;
    }

    return isLogin() && isChoose;
}