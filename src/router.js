import Vue from 'vue';
import Router from 'vue-router';
import login from './view/login.vue';
import painel from './view/painel.vue';





Vue.use(Router);

const router = new Router({

  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,    
    },
    {
      path: '/painel',
      name: 'painel',
      component: painel,
      beforeEnter: (to , from , next)  => {
        if (!sessionStorage.usuario) {
          console.log("Funcionário não existe!");
          next({
            name: "login"
          })
        }else if(sessionStorage.usuario){
          console.log("Funcionário existe!");
          next()
        }
      }      
    },
  ]
})

export default router