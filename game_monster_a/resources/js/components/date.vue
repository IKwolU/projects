<template>
    <p>{{ GetData(date) }}</p>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "date",
    props: ['date'],
    methods: {
        GetData(data){
            const options = {
                day: 'numeric',
                month: 'long',
                timezone: 'UTC',
                hour: 'numeric',
                minute: 'numeric'
            };
            return new Date(data).toLocaleString("ru", options).replace(' в', ',');
        }
    }
})
</script>

<style scoped>

</style>
