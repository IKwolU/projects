<script setup>

import NumberInputMask from "../numberInputMask.vue";
import {ref} from "vue";
import {router} from "@inertiajs/vue3";
import ModalPopUp from "../modalPopUp.vue";
import TheProfileLinkedComponent from "./TheProfileLinkedComponent.vue";

const props = defineProps(['user']);


let email = ref(props.user.email !== 'undefined' ? props.user.email : '');
let nickName = ref(props.user.nickName !== 'undefined' ? props.user.nickName : '');
let telNumber = ref(props.user.telNumber !== 'undefined' ? props.user.telNumber : '');

let old_password = ref('');
let new_password = ref('');
let new_password_confirmation = ref('');

let showModalState = ref(false);

function sendMainData() {
  const data = {
    'email': email.value,
    'nickName': nickName.value,
    'telNumber': telNumber.value
  };
  console.log(data);
  router.post('/profile/update/' + props.user.id, data);
}

function updatePassword() {
  const data = {
    'old_password': old_password.value,
    'new_password': new_password.value,
    'new_password_confirmation': new_password_confirmation.value
  }

  router.post('/profile/updatePassword/' + props.user.id, data, {
    onSuccess: () => {
      showModalState.value = true;
    }
  });
}
</script>

<template>
  <ModalPopUp v-if="showModalState" @close="() => {showModalState = false}" title="Пароль изменён" />
  <div class="flex max-w-[1044px] xl:flex-col justify-between">
    <div>
      <h2 class="text-[24px] mb-[34px]">Аккаунт</h2>
      <div class="flex sm:flex-col gap-[40px]">
        <div class="flex flex-col gap-[11px]">
          <div class="relative">
            <input name="nickName" v-model="nickName" class="bg-[#2C2C2C] sm:w-full relative focus:ring-0 rounded-[6px] h-auto pt-[28px] pl-[16px]"
                   type="text">
            <p class="absolute left-[16px] top-[11px] text-[12px] text-[#A5A5A5]">Никнейм</p>
          </div>
          <div class="relative">
            <input name="email" v-model="email"
                   class="bg-[#2C2C2C] relative focus:ring-0 rounded-[6px] sm:w-full h-auto pt-[28px] pl-[16px]"
                   type="email"
            >
            <p class="absolute left-[16px] top-[11px] text-[12px] text-[#A5A5A5]">E-mail</p>
          </div>
          <div class="relative">
            <NumberInputMask @telNumber="(data) => {telNumber = data}" :telNumber="telNumber"
              class="bg-[#2C2C2C] sm:w-full placeholder-[#A3A3A3] relative focus:ring-0 rounded-[6px] h-auto pt-[28px] pl-[16px]"/>
            <p class="absolute left-[16px] top-[11px] text-[12px] text-[#A5A5A5]">Телефон</p>
          </div>
          <div>
            <button @click="sendMainData()"
              class="ring-2 mt-2 ring-[#4E4E4E] rounded-[6px] py-[14px] px-[20px] text-[#757575] hover:bg-c_orange hover:ring-c_orange hover:text-white transition-all"
            >
              Сохранить изменения
            </button>
          </div>
        </div>
        <div class="flex flex-col gap-[11px]">
          <input
            v-model="old_password"
            class="bg-[#2C2C2C] placeholder-[#A3A3A3] relative focus:ring-0 rounded-[6px] h-auto pt-[18px] pl-[16px] pb-[18px]"
            type="password"
            placeholder="Старый пароль"
            name="password"
          >
          <p v-if="$page.props.errors.old_password"
             style="color: #e04a4a; font-size: 12px; margin-top: -10px;">
            {{ $page.props.errors.old_password }}</p>
          <input
            v-model="new_password"
            class="bg-[#2C2C2C] placeholder-[#A3A3A3] relative focus:ring-0 rounded-[6px] h-auto pt-[18px] pl-[16px] pb-[18px]"
            type="password"
            placeholder="Новый пароль"
            name="new_password"
          >
          <input
            v-model="new_password_confirmation"
            class="bg-[#2C2C2C] placeholder-[#A3A3A3] relative focus:ring-0 rounded-[6px] h-auto pt-[18px] pl-[16px] pb-[18px]"
            type="password"
            placeholder="Повторите пароль"
            name="new_password_confirmation"
          >
          <p v-if="$page.props.errors.new_password_confirmation"
             class="text-red-500 text-sm"
          >
            {{ $page.props.errors.new_password_confirmation }}</p>
          <div>
            <button
              @click="updatePassword()"
              class="ring-2 mt-2 ring-[#4E4E4E] rounded-[6px] py-[14px] px-[20px] text-[#757575] hover:bg-c_orange hover:ring-c_orange hover:text-white transition-all"
            >
              Обновить пароль
            </button>
          </div>
        </div>
      </div>
    </div>
    <TheProfileLinkedComponent :user="user" />
  </div>

</template>

<style scoped>

</style>
