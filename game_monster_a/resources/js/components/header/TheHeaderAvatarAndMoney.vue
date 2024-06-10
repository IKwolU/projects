<script setup>
import {Link} from "@inertiajs/vue3";
import UserAvatar from "../userAvatar.vue";
const props = defineProps(['user'])

</script>

<template>
  <div class="flex">
    <div class="header-profile__balance">
      <p>{{ user.money }} ₽</p>
    </div>
      <div class="header-profile__img">
        <Link href="/profile">
          <UserAvatar class="h-[40px] w-[40px]" :user="user" />
        </Link>
        <div class="relative flex items-center group">
          <img class="profile-img__arrow" src="../../../image/icons/arrow.svg" alt="arrow">
          <div class="absolute hidden group-hover:block right-0 bottom-[-30px] bg-black bg-opacity-50 backdrop:blur p-2 border-[1px] border-gray-700 rounded-xl">
            <a class="hover:underline" href="/logout">Выход</a>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped>

</style>
