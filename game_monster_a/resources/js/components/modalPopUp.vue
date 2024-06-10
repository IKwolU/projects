<script setup>
import {ref} from "vue";

const emit = defineEmits(['close']);
const props = defineProps(['title']);
const show = ref('true');

function close() {
  this.show = false;
  setTimeout(() => emit('close'), 300);
}
</script>

<template>
  <teleport to="body">
    <transition
      appear
      enter-from-class="transform translate-x-[500px]"
      enter-active-class="duration-300"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-active-class="duration-300"
      leave-to-class="translate-x-[500px]"
    >
      <div @click="close()" v-if="show"
           class="fixed cursor-pointer z-30 right-[30px] bottom-[30px] w-[300px] bg-[#0C9B2C] px-[25px] py-[18px] rounded-lg">
        <p class="text-white text-[18px] font-[600] drop-shadow">{{ title }}</p>
      </div>
    </transition>
  </teleport>
</template>
