<script setup>
const isMobile = () => screen.width <= 760;
</script>
<template>
    <div v-if="!isMobile()" class="langs pc-fade">
        <div class="item font-bold text-white text-lg cursor-pointer">ru</div>
        <span>/</span>
        <div class="item cursor-pointer">en</div>
    </div>
</template>

