<template>
    <h1 class="text-4xl text-gray-900 dark:text-white uppercase">
       <slot />
    </h1>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "TitlePage",
})
</script>

<style scoped>

</style>
