<script>
import { UserManager, WebStorageStateStore } from 'oidc-client';

export default {
  mounted() {
    const settings = {
      response_mode: 'query',
      userStore: new WebStorageStateStore(),
    };

    new UserManager(settings).signinRedirectCallback().then((user) => {
      if (user && user.state) {
        window.location.href = user.state;
      } else {
        window.location.href = window.location.origin;
      }
    }).catch((err) => {
      console.error(err);
    });
  },
};
</script>
