<script setup>
import {ref} from "vue";

const props = defineProps(['user']);


let AvatarColor = ref(StringToColorAvatar());
function StringToColorAvatar() {
  let hash = 0;
  let str = props.user.email + props.user.login;
  str.split('').forEach(char => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
  })
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += value.toString(16).padStart(2, '0')
  }
  return 'background-color:' + colour;
}
</script>

<template>
  <img
    v-if="user.avatar !== null"
    :src="user.avatar"
    alt="Profile avatar"
    class="profile__img-header rounded-full object-cover"
  >
  <div v-else class="rounded-full flex justify-center items-center" :style="AvatarColor">
    <p v-if="(typeof user.login) !== 'undefined'" class="uppercase text-xl drop-shadow">
      {{ user.login[0] }}{{ user.login[1] }}
    </p>
    <p v-else-if="(typeof user.email) !== 'undefined'" class="uppercase text-xl drop-shadow">
      {{ user.email[0] }}{{ user.email[1] }}
    </p>
  </div>
</template>

<style scoped>

</style>
