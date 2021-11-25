<!--
    Generic modal with a slot to display any component. It's used to display
    the BuyTicketBlock on the LandingPage.
-->

<template>
    <transition name="modal" v-if="modalShowing">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div class="modal-content">
                        <slot name="content">
                            default content
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="Button modal-default-button" @click="closeModal()">
                                OK
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: mapState({
    modalShowing: (state) => state.appContext.modalShowing,
  }),
  methods: {
    ...mapMutations({
      closeModal: 'appContext/HIDE_MODAL'
    })
  }
};
</script>
