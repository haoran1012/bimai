// 全局守卫导航

import { isChooseId, isLogin } from "@/framework/utils/perssion";
import { addBasePath } from "./routers";

const routerBeforeach = (to, from, next)=>{

    if (to.meta.requireAuth) {
        //已登录
        if (isChooseId) {
            //如果是登录过来的,则到主页
            if (to.path === "/login") {
                next(addBasePath("/"));
            }
            else {
                next();
            }

        }
        else {
            next(addBasePath("/login"));
        }
    }
    else {
        next();
    }
}

export default routerBeforeach;