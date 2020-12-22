<template>
  <div>
    <nav class="Page-container LoginBar">
      <button class="btn" @click="login" v-if="!isLoggedIn">Login</button>
      <button class="btn" @click="logout" v-if="isLoggedIn">{{ username }}, Logout</button>
    </nav>
    <RouterView />
  </div>
</template>

<style lang="less" scoped>
  .LoginBar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 99;
    align-items: center;
  }

  .LoginBar .btn {
    position: absolute;
    top: 30px;
    right: 180px;
  }
</style>

<script>
import AuthService from '@/authService';

const authService = new AuthService();

export default {
  data() {
    return {
      isLoggedIn: false,
      username: '',
    };
  },
  methods: {
    login() {
      authService.login();
    },
    logout() {
      authService.logout();
    },
  },
  mounted() {
    authService.getUser().then((user) => {
      this.isLoggedIn = (user && !user.expired);

      if (this.isLoggedIn) {
        this.username = user.profile.name;
      }
    });

    /*
     * If the `epieditmode` parameter is present we know we're
     * in either edit- or preview mode and should include following scripts.
     */
    if (this.$route.query.epieditmode || document.location.search.includes('epieditmode')) {
      const domainScript = document.createElement('script');
      domainScript.innerHTML = 'document.domain = \'localhost\';';
      document.body.appendChild(domainScript);

      const communicationScript = document.createElement('script');
      communicationScript.src = `${process.env.VUE_APP_CONTENT_DELIVERY_API}/episerver/cms/latest/clientresources/epi-cms/communicationinjector.js`;
      document.body.appendChild(communicationScript);
    }
  },
};
</script>
