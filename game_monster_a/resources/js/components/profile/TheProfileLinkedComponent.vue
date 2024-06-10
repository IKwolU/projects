<script setup>
import TheProfileLinkedBlock from "./TheProfileLinkedBlock.vue";
import ModalPopUp from "../modalPopUp.vue";
import {router} from "@inertiajs/vue3";
import {ref} from "vue";

const props = defineProps(['user']);
let showModalState = ref(false);
let modalTitle = ref('');

let socialData = [
  {
    socialId: 'steam',
    socialName: 'Steam',
    socialLogin: ''
  },
  {
    socialId: 'google',
    socialName: 'Google',
    socialLogin: ''
  },
  {
    socialId: 'vk',
    socialName: 'Вконтакте',
    socialLogin: ''
  },
  {
    socialId: 'facebook',
    socialName: 'FaceBook',
    socialLogin: ''
  }
];

const socialDataAuthorised = socialData.filter((social) => props.user[social.socialId] !== null);
const socialDataNoAuthorised = socialData.filter((social) => props.user[social.socialId] === null);

const opacity = index => 'opacity: ' + (100 - ((socialDataAuthorised.length + index) * 20)) + '%;';
const deleteSocial = socialId => {
  router.post(`/profile/deleteSocial/${socialId}`);
}
</script>

<template>
  <div class="flex flex-col gap-[9px]">
    <h2 class="text-[24px] mb-[34px] xl:mt-[34px]">Привязанные аккаунты</h2>
    <TheProfileLinkedBlock
      v-for="(social) in socialDataAuthorised"
      :social="social"
      :user="user"
      @deleteSocial="(socialId) =>{deleteSocial(socialId)}"
    />
    <a
      v-for="(social, index) in socialDataNoAuthorised"
      :href="'/login/'+social.socialId"
    >
      <TheProfileLinkedBlock
        :style="opacity(index)"
        :social="social"
        :user="user"
      />
    </a>
  </div>
</template>

<style scoped>

</style>
