<script setup>
defineProps(['pageName', 'pageId', 'pageCurrentId']);
defineEmits(['selectPage'])
</script>

<template>
  <li @click="$emit('selectPage', pageId)" class="relative cursor-pointer transition-all"
      :class="{'selected' : pageId === pageCurrentId, 'no_selected' : pageId !== pageCurrentId,}"
  >
    <p class="text-[20px] font-[500] sm:text-[14px] text-center">{{ pageName }}</p>
    <div class="w-full bg-white h-[2px] absolute bottom-[-18px] hidden"></div>
  </li>
</template>

<style scoped>
.no_selected p{
  color: #676665;
}
.selected div{
  display: block;
}
</style>
