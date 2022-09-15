<script setup>
import { ContentLoader } from "@episerver/content-delivery";

const props = defineProps(["model"]);
const artists = ref({});

onBeforeMount(() => {
  const contentLoader = new ContentLoader();
  contentLoader
    .getChildren(props.model.contentLink.guidValue, {
      branch: props.model.language.name,
    })
    .then((children) => {
      const ordered = children.sort(
        (a, b) => a.artistName.toLowerCase() < b.artistName.toLowerCase()
      );

      // Group by first letter of artist name
      artists.value = ordered.reduce((groups, item) => {
        const letter = item.artistName.substring(0, 1);
        groups[letter] = groups[letter] || [];
        groups[letter].push(item);
        return groups;
      }, {});
    });
});
</script>

<template>
  <div class="ArtistContainerPage">
    <nav class="Page-container PageHeader NavBar">
      <BackButton :previousUrl="model.parentLink.url" />
      <LanguageSelector
        :existingLanguages="model.existingLanguages"
        :language="model.language"
      />
    </nav>

    <div class="Page-container">
      <div class="top gutter">
        <h1 v-epi-edit="'Name'">{{ model.name }}</h1>
      </div>
      <div class="list">
        <div v-for="(value, key) in artists" :key="key">
          <h3>{{ key }}</h3>
          <Card
            v-for="(value, key) in value"
            :key="key"
            :name="value.artistName"
            :image="value.artistPhoto"
            :url="value.url"
          />
        </div>
      </div>
    </div>

    <footer>
      <div class="FooterBottom">
        <h6>&copy; Music Festival 2022</h6>
      </div>
    </footer>
  </div>
</template>

<style lang="less" scoped>
.top h1 {
  text-transform: none;
  margin: 0 40px 0 40px;
  padding: 0.3em 0;

  @media (min-width: 425px) {
    margin-right: 140px;
  }
}
h3 {
  text-transform: uppercase;
  width: 100%;
  text-align: center;
  background: rgba(236, 64, 122, 0.24);
  padding: 5px 0 7px;
  margin: 0;
}
</style>
