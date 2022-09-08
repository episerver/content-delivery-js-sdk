<script setup>
defineProps(["model"]);
const { showModal } = useModal();
</script>

<template>
  <div class="LandingPage">
    <nav class="Page-container PageHeader NavBar">
      <button class="Button buy-ticket-button" @click="showModal()">
        {{ model.buyTicketBlock.heading }}
      </button>

      <LanguageSelector
        :existingLanguages="model.existingLanguages"
        :language="model.language"
      />
    </nav>

    <Hero
      :title="model.title"
      :subtitle="model.subtitle"
      :heroimage="model.heroImage"
    />

    <EpiserverLink
      :url="model.artistsLink.expanded.url"
      :class-name="'Button modal-default-button landing-page-button'"
    >
      {{ model.artistsLink.expanded.name }}
    </EpiserverLink>

    <main class="Page-container">
      <div v-epi-edit="'MainContentArea'">
        <EpiserverContentArea :model="model.mainContentArea" />
      </div>
    </main>

    <footer>
      <div v-epi-edit="'FooterContentArea'">
        <EpiserverContentArea :model="model.footerContentArea" />
      </div>
      <div class="FooterBottom">
        <h6>&copy; Music Festival 2022</h6>
      </div>
    </footer>

    <Modal>
      <template v-slot:content>
        <BuyTicketBlock
          :page-property-name="'BuyTicketBlock'"
          :heading="model.buyTicketBlock.heading"
          :message="model.buyTicketBlock.message"
        />
      </template>
    </Modal>
  </div>
</template>

<style lang="less">
@import "../../assets/styles/common/variables.less";

main,
footer {
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
