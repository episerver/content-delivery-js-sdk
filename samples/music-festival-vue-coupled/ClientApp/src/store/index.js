/*
 * The main vuex store. This holds the state of the URL and makes sure that
 * when the URL is updated, the model gets updated too.
 */

import { createStore } from 'vuex';
import appContext from './modules/appContext'; // Module handling app specific state
import epiContext from './modules/epiContext'; // Module handling Optimizely specific state
import epiDataModel from './modules/epiDataModel'; // Module handling model state

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    appContext,
    epiContext,
    epiDataModel,
  },
});
