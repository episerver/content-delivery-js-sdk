<template>
  <div></div>
</template>

<script>
import authService from '@/authService';

export default {
  mounted() {
    authService.userManager.signinRedirectCallback().then((user) => {
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
