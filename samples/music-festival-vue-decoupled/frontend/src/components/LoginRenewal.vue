<template>
  <div></div>
</template>

<script>
import { UserManager } from 'oidc-client';

export default {
  mounted() {
    new UserManager().signinSilentCallback();
  },
};
</script>
