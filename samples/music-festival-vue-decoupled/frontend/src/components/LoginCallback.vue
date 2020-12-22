<script>
import { UserManager, WebStorageStateStore } from 'oidc-client';

export default {
  mounted() {
    const setting = {
      response_mode: 'query',
      userStore: new WebStorageStateStore(),
    };

    new UserManager(setting).signinRedirectCallback().then(() => {
      // Just refresh the start page.
      window.location.href = window.location.origin;
    }).catch((err) => {
      console.error(err);
    });
  },
};
</script>
