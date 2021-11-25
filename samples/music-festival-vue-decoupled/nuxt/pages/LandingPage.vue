<!--
    Landing page for the site.
    When the BuyTicketBlock modal is shown, the OPE overlays in
    the Hero are turned off through the `showModal` data property.
-->

<template>
    <div class="LandingPage">
        <nav class="Page-container PageHeader NavBar">
            <button class="Button buy-ticket-button" @click="showModal()">
                {{model.buyTicketBlock.heading}}
            </button>

            <LanguageSelector :existingLanguages="model.existingLanguages"
                              :language="model.language" />
        </nav>

        <Hero :title="model.title"
              :subtitle="model.subtitle"
              :heroimage="model.heroImage" />

        <EpiLink :class-name="'Button modal-default-button landing-page-button'"
                 :url="model.artistsLink.expanded.url">
            {{model.artistsLink.expanded.name}}
        </EpiLink>

        <main class="Page-container">
            <div>
                <EpiContentArea :model="model.mainContentArea" />
            </div>
        </main>

        <footer>
            <div>
                <EpiContentArea :model="model.footerContentArea" />
            </div>
            <div class="FooterBottom">
                <h6>&copy; Music Festival 2020</h6>
            </div>
        </footer>

        <Modal>
            <template v-slot:content>
                <BuyTicketBlock :page-property-name="'BuyTicketBlock'"
                                :heading="model.buyTicketBlock.heading"
                                :message="model.buyTicketBlock.message" />
            </template>
        </Modal>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: ['model'],
  methods: {
    showModal() {
      this.$store.commit('appContext/SHOW_MODAL');
    }
  }
};
</script>
