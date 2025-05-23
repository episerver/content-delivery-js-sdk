import { createRouter, createWebHistory } from "vue-router";
import { ResolvedContentStatus } from "@episerver/content-delivery";
import { UPDATE_PREVIEW_TOKEN } from "@/store/modules/epiContext";
import { UPDATE_MODEL_BY_URL } from "@/store/modules/epiDataModel";
import { parsePreviewToken } from "@/urlHelpers";
import store from "@/store";
import PageComponentSelector from "@/components/EpiPageComponentSelector.vue";
import AccessDenied from "@/views/403.vue";
import NotFound from "@/views/404.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/access-denied",
      component: AccessDenied,
    },
    {
      path: "/not-found",
      component: NotFound,
    },
    {
      name: "page-component-selector",
      path: "/:pathMatch(.*)",
      component: PageComponentSelector,
    },
  ],
});

router.beforeEach((to, from, next) => {
  // URL is updated by vue-route-sync, and when time travelling with the
  // debugger we don't want to trigger a model commit as the model is already
  // part of the store holding the url update.
  if (to.name === "page-component-selector" && store.state.epiDataModel.model.url !== to.fullPath) {
    var parsed = parsePreviewToken(to.fullPath);
    store.commit(UPDATE_PREVIEW_TOKEN, parsed.previewToken);
    store.dispatch(UPDATE_MODEL_BY_URL, parsed.url).then(() => {
      switch (store.state.epiDataModel.status) {
        case ResolvedContentStatus.NotFound:
          router.replace("/not-found");
          break;
        case ResolvedContentStatus.Unauthorized:
          router.replace("/access-denied");
          break;
        case ResolvedContentStatus.AccessDenied:
          router.replace("/access-denied");
          break;
        default:
      }
    });
  }

  next();
});

export default router;
