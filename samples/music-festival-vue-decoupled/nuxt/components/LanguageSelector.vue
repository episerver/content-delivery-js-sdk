<!--
    Language selector that can be shown on any page.
-->

<template>
    <ul class="lang">
        <li v-for="item in existingLanguages"
            :key="item.name"
            :class="{ active: isCurrentLanguage(item) }">
            <EpiViewModeLink :url="item.link">{{item.displayName}}</EpiViewModeLink>
        </li>
    </ul>
</template>

<script>

export default {
  props: ['existingLanguages', 'language'],
  methods: {
    isCurrentLanguage(item) {
      return item.name === this.language.name;
    },
  }
};
</script>
