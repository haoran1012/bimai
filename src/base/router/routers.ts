import { RouteRecordRaw } from 'vue-router'

export const addBasePath = path =>{
    let base: string = "/3d/dist";
    return  process.env.NODE_ENV == "development" ? path :  base + path;
    // return base + path;
}

export const defineRoutes: Array<RouteRecordRaw> = [
  {
    path: addBasePath('/'),
    component: () => import('@/plugin/views/Main.vue'),
    meta: {
      //需要权限
      requireAuth: false
    }
  },
  {
    path: addBasePath('/index.html'),
    redirect: addBasePath('/')
  }

  //   {
  //     path: addBasePath('/404'),
  //     name: '404',
  //     component: () => import('@/plugin/views/error-page/404.vue'),
  //     meta: {
  //       requireAuth: false
  //     }
  //   }
  // {
  //     path: "/:pathMatch(.*)",
  //     redirect: '/404'
  // }
]

// export defineRoutes;
