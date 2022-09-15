<script setup>
const props = defineProps(["model"]);

const friendlyStartTime = computed(() => {
  return friendlyDateTime(props.model.performanceStartTime);
});

const friendlyEndTime = computed(() => {
  return friendlyDateTime(props.model.performanceEndTime);
});

function friendlyDateTime(dateTime) {
  return new Date(dateTime).toLocaleString("en");
}
</script>

<template>
  <div class="ArtistDetailsPage">
    <nav class="Page-container PageHeader NavBar">
      <BackButton :previousUrl="model.parentLink.url" />
      <LanguageSelector
        :existingLanguages="model.existingLanguages"
        :language="model.language"
      />
    </nav>

    <div class="Page-container u-posRelative">
      <ArtistImage :name="model.artistName" :image-url="model.artistPhoto" />

      <div class="top">
        <h1 v-epi-edit="'ArtistName'">{{ model.artistName }}</h1>
      </div>

      <EpiserverProperty property-name="ArtistPhoto" />
      <EpiserverProperty property-name="ArtistGenre" />
      <EpiserverProperty property-name="ArtistIsHeadliner" />

      <div class="artist-information">
        <p v-epi-edit="'StageName'" v-html="model.stageName"></p>
        <p>
          <span v-epi-edit="'PerformanceStartTime'">{{ friendlyStartTime }}</span>
          -
          <span v-epi-edit="'PerformanceEndTime'">{{ friendlyEndTime }}</span>
        </p>
      </div>
      <div class="artist-description">
        <div
          v-epi-edit="'ArtistDescription'"
          v-html="model.artistDescription"
        ></div>
      </div>
    </div>

    <footer>
      <div class="FooterBottom">
        <h6>&copy; Music Festival 2022</h6>
      </div>
    </footer>
  </div>
</template>
