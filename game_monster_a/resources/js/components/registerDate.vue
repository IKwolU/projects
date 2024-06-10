<script setup>
const props = defineProps(['date']);

const getDate = data => {
  const current = new Date();
  const created_at = new Date(data);
  return ((current - created_at) / (1000 * 60 * 60 * 24)).toFixed(0);
};
</script>

<template>
<span>{{ getDate(date) }} дней</span>
</template>

<style scoped>

</style>
