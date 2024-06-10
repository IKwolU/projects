<template>
    <Head title="Админ панель" />
    <div class="flex w-full relative z-40 overflow-x-hidden">
        <TheSideBar/>
        <div class="p-4 text-white pt-[50px] min-h-screen w-full h-full bg-gray-900 bg-opacity-70 flex flex-col items-center">
            <slot/>
        </div>

    </div>
</template>

<script setup>
import {onMounted} from 'vue'
import TheSideBar from "../admin/TheSideBar.vue";
import {Head} from "@inertiajs/vue3";
import { initFlowbite } from 'flowbite'

onMounted(() => {
  initFlowbite();
});
</script>

<style>
</style>
