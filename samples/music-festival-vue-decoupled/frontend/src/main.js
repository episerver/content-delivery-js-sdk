import { createApp } from 'vue';
import App from './App.vue';
import EpiEdit from './directives/epiEdit';
import router from './router';
import store from './store';
import './epiBootstrap';
import './assets/styles/main.less';

const app = createApp(App)
  .directive('epi-edit', EpiEdit)
  .use(store)
  .use(router);

// Register all Optimizely view components globally. This requires webpack!
// Otherwise we need to register all components manually here in main.js.
const requireComponent = require.context('./views', true, /.vue$/);

requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);

  // Gets the component name regardless folder depth
  const componentName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');

  // Look for the component options on `.default`, which will
  // exist if the component was exported with `export default`,
  // otherwise fall back to module's root.
  app.component(componentName, componentConfig.default || componentConfig);
});

app.mount('#app');
