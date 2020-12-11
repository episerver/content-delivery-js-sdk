import store from '@/store';
import { createRouter, createWebHistory } from 'vue-router';
import { UPDATE_MODEL_BY_URL } from '@/store/modules/epiDataModel';
import PageComponentSelector from '@/components/EpiPageComponentSelector.vue';

const router = createRouter({
  // Use the HTML HistoryAPI so the # isn't needed in the URL, and
  // Vue routing will work even when going directly to an URL.
  history: createWebHistory(),

  routes: [
    // Put additional routes before the wildcard
    {
      path: '/:pathMatch(.*)',
      component: PageComponentSelector,
    },
  ],
});

router.beforeEach((to, from, next) => {
  // URL is updated by vue-route-sync, and when time travelling with the
  // debugger we don't want to trigger a model commit as the model is already
  // part of the store holding the url update.
  if (store.state.epiDataModel.model.url !== to.fullPath) {
    store.dispatch(UPDATE_MODEL_BY_URL, to.fullPath);
  }

  next();
});

export default router;
