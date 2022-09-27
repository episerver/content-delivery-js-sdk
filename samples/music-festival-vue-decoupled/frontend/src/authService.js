import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

class AuthService {
  constructor() {
    const settings = {
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      authority: process.env.VUE_APP_LOGIN_AUTHORITY,
      client_id: process.env.VUE_APP_LOGIN_CLIENT_ID,
      redirect_uri: `${window.location.origin}/login-callback`,
      silent_redirect_uri: `${window.location.origin}/login-renewal`,
      response_type: 'code',
      scope: 'openid profile offline_access email roles epi_content_delivery',
      post_logout_redirect_uri: window.location.origin,
      filterProtocolClaims: true,
      loadUserInfo: true,
    };

    this.userManager = new UserManager(settings);
  }

  getUser() {
    return this.userManager.getUser();
  }

  login() {
    const args = {
      state: window.location.href,
    };

    return this.userManager.signinRedirect(args);
  }

  logout() {
    return this.userManager.signoutRedirect();
  }

  getAccessToken() {
    return this.userManager.getUser().then((data) => (data ? data.access_token : null));
  }
}

const authService = new AuthService();

export default authService;
