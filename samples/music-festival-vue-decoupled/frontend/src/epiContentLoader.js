/*
 * Wraps the calls to the ContentDeliveryAPI. It's used by the vuex
 * `epiDataModel` module and the `ArtistContainerPage` component.
 */

import axios from 'axios';
import AuthService from '@/authService';

const authService = new AuthService();

async function defaultHeaders() {
  await authService.getAccessToken().then((acessToken) => {
    axios.defaults.headers.common.Authorization = `Bearer ${acessToken}`;
  }, (err) => {
    console.error(err);
  });
}

async function get(url, parameters, headers) {
  await defaultHeaders();
  return axios({
    method: 'get',
    baseURL: `${process.env.VUE_APP_CONTENT_DELIVERY_API}/api/episerver/v2.0`,
    url,
    params: parameters,
    headers: { ...headers },
  });
}

export default {
  /*
   * Getting content with the content link is the default way of calling the ContentDeliveryAPI.
   * It is used in MusicFestival to get:
   *  - block data
   *  - updated data after a `contentSaved` message, which has the content link
   */
  getContentByContentLink: (contentLink, parameters) => get(`/content/${contentLink}`, parameters),

  /*
   * Getting data from ContentDeliveryAPI through regular routing (friendly URLs) was
   * added in ContentDeliveryAPI 2.3.0.
   * It is used in MusicFestival to get:
   *  - page data, through the vuex `epiDataModel` module
   */
  getContentByUrl: (url, parameters) => get(
    '/content',
    {
      contentUrl: url,
      matchExact: false,
      ...parameters,
    },
  ),

  /*
   * Getting children with the content link is the default way of calling the ContentDeliveryAPI.
   * It is used in MusicFestival to get:
   *  - artist list in ArtistContainerPage.vue
   */
  getChildrenByContentLink: (contentLink, parameters) => get(
    `/content/${contentLink.guidValue}/children`,
    parameters,
    { 'Accept-Language': contentLink.language.name },
  ),
};
