<script setup>
import {usePage} from "@inertiajs/vue3";

const page = usePage();
const props = defineProps(['price', 'tax']);

let sum = props.price + (props.price * page.props.tax / 100);

</script>

<template>
  {{ Number(sum).toFixed(0) }} ₽
</template>
