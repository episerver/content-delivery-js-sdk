<!--
    Displays an artist image.
-->

<template>
    <div class="artistImage">
        <div>
            <ConditionalImage :src="imageUrl" :alt="name" />
        </div>
    </div>
</template>

<script>

export default {
  props: ['name', 'imageUrl'],
};
</script>

<style scoped>
    .artistImage {
        padding-top: 80px;
    }

    img {
        width: 100%;
        height: auto;
        animation: fadein 2s;
    }

    @keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
</style>
