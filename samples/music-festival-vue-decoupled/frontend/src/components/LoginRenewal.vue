<template>
  <div></div>
</template>

<script>
import authService from '@/authService';

export default {
  mounted() {
    authService.userManager.signinSilentCallback();
  },
};
</script>
