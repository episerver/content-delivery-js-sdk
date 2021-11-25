import vue from 'vue';
import Router from 'vue-router';
import PageComponentSelector from '~/components/EpiPageComponentSelector';

vue.use(Router);

export function createRouter() {
  return new Router({
    mode: "history",
    routes: [
      {
        name: 'page-component-selector',
        path: '/:pathMatch(.*)',
        component: PageComponentSelector
      }
    ]
  });
}
