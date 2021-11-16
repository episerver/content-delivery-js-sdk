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
            <div v-epi-edit="'MainContentArea'">
                <ContentArea :model="model.mainContentArea" />
            </div>
        </main>

        <footer>
            <div v-epi-edit="'FooterContentArea'">
                <ContentArea :model="model.footerContentArea" />
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
import ContentArea from '@/components/EpiContentArea.vue';
import EpiLink from '@/components/EpiLink.vue';
import Hero from '@/components/widgets/Hero.vue';
import LanguageSelector from '@/components/widgets/LanguageSelector.vue';
import Modal from '@/components/widgets/Modal.vue';
import BuyTicketBlock from '@/views/blocks/BuyTicketBlock.vue';
import { SHOW_MODAL } from '@/store/modules/appContext';

export default {
  components: {
    ContentArea,
    Hero,
    LanguageSelector,
    EpiLink,
    Modal,
    BuyTicketBlock,
  },
  props: ['model'],
  methods: mapMutations({
    showModal: SHOW_MODAL,
  }),
};
</script>

<style lang="less">
    @import '../../assets/styles/common/variables.less';

    main, footer {
        overflow: hidden;
        width: 100%;
    }

    footer .ContentArea.Grid--gutterA {
        // Disable gutters because we want this content area to be full width.
        margin: 0;
    }

    .landing-page-button {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 1em;
    }

    .buy-ticket-button {
        margin-top: 11px;
    }
</style>
