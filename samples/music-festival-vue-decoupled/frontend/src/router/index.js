import { createRouter, createWebHistory } from 'vue-router';
import { ResolvedContentStatus } from '@episerver/content-delivery';
import { UPDATE_MODEL_BY_URL } from '@/store/modules/epiDataModel';
import store from '@/store';
import authService from '@/authService';
import PageComponentSelector from '@/components/EpiPageComponentSelector.vue';
import LoginCallback from '@/components/LoginCallback.vue';
import LoginRenewal from '@/components/LoginRenewal.vue';
import AccessDenied from '@/views/403.vue';
import NotFound from '@/views/404.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login-callback',
      component: LoginCallback,
    },
    {
      path: '/login-renewal',
      component: LoginRenewal,
    },
    {
      path: '/access-denied',
      component: AccessDenied,
    },
    {
      path: '/not-found',
      component: NotFound,
    },
    {
      name: 'page-component-selector',
      path: '/:pathMatch(.*)',
      component: PageComponentSelector,
    },
  ],
});

router.beforeEach((to, from, next) => {
  // URL is updated by vue-route-sync, and when time travelling with the
  // debugger we don't want to trigger a model commit as the model is already
  // part of the store holding the url update.
  if (to.name === 'page-component-selector' && store.state.epiDataModel.model.url !== to.fullPath) {
    store.dispatch(UPDATE_MODEL_BY_URL, to.fullPath).then(() => {
      switch (store.state.epiDataModel.status) {
        case ResolvedContentStatus.NotFound:
          router.replace('/not-found');
          break;
        case ResolvedContentStatus.Unauthorized:
          // Prevent redirect loop.
          authService.getUser().then((user) => {
            if (!user || user.expired) {
              authService.login();
            } else {
              router.replace('/access-denied');
            }
          });
          break;
        case ResolvedContentStatus.AccessDenied:
          router.replace('/access-denied');
          break;
        default:
      }
    });
  }

  next();
});

export default router;
