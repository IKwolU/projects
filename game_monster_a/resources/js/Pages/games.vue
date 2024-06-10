<script setup>
import {Head} from "@inertiajs/vue3";
import Layout from "../components/layouts/layout.vue";
import GameList from "../components/GameList.vue";
import IndexClip from "../components/pageClips/indexClip.vue";

const props = defineProps(['games']);
</script>

<template>
  <Head title="Игры" />
<Layout>
  <teleport to="body">
    <IndexClip />
  </teleport>
  <GameList class="relative z-10" :showAllGamesLink="false" :games="games" />
</Layout>
</template>

<style scoped>

</style>
