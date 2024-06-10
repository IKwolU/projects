<script setup>
import {useIMask} from 'vue-imask';

defineEmits(['telNumber']);
const props = defineProps(['telNumber']);

const telNumberLocal = props.telNumber;

const {el, masked} = useIMask({
  mask: '+0(000)000-00-00',
  radix: '.',
});

</script>

<template>
  <input @change="$emit('telNumber', telNumberLocal)" v-model="telNumberLocal" ref="el" type="tel">
</template>

<style scoped>

</style>
