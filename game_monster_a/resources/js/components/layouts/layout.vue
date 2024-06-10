<script setup>
import TheFooter from "../TheFooter.vue";
import TheHeader from "../TheHeader.vue";
</script>

<template>
    <div class="body">
        <TheHeader/>
        <slot/>
        <TheFooter/>
    </div>
</template>
