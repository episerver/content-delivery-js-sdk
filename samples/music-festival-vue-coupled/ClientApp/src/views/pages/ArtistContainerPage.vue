<!--
    A list of all the artists that are children pages to this page.
-->

<template>
    <div class="ArtistContainerPage">
        <nav class="Page-container PageHeader NavBar">
            <BackButton :prevUrl="model.parentLink.url" />
            <LanguageSelector :existingLanguages="model.existingLanguages"
                              :language="model.language" />
        </nav>

        <div class="Page-container">
            <div class="top gutter">
                <h1 v-epi-edit="'Name'">{{model.name}}</h1>
            </div>
            <div class="list">
                <div v-for="(value, key) in artists" :key="key">
                    <h3>{{key}}</h3>
                    <Card :name="value.artistName" :url="value.url" :image="value.artistPhoto"  v-for="(value, key) in value" :key="key" />
                </div>
            </div>
        </div>

        <footer>
            <div class="FooterBottom">
                <h6>&copy; Music Festival 2020</h6>
            </div>
        </footer>
    </div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import { ContentLoader } from '@episerver/content-delivery';
import BackButton from '@/components/widgets/BackButton.vue';
import Card from '@/components/widgets/Card.vue';
import LanguageSelector from '@/components/widgets/LanguageSelector.vue';

export default {
  props: ['model'],
  data() {
    return {
      artists: {},
    };
  },
  computed: mapState({
    url: (state) => state.epiDataModel.model.url,
  }),
  created() {
    this.updateData();
  },
  watch: {
    model: 'updateData',
  },
  methods: {
    async updateData() {
      const contentLoader = new ContentLoader();
      contentLoader.getChildren(this.model.contentLink.guidValue, { branch: this.model.language.name }).then((children) => {
        // Sort response alphabetically
        const ordered = _.orderBy(children, [(artist) => artist.artistName.toLowerCase()], ['asc']);
        // Group them by first letter of artist name and store in data.artists object
        this.artists = _.groupBy(ordered, (artist) => artist.artistName.substring(0, 1));
      });
    },
  },
  components: {
    BackButton,
    Card,
    LanguageSelector,
  },
};
</script>

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
        background: rgba(236, 64, 122, .24);
        padding: 5px 0 7px;
        margin: 0;
    }
</style>
