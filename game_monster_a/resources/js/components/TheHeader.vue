<script setup>
import AuthSelect from "./authSelect.vue";
import LangSelect from "./langSelect.vue";
import {Link, usePage} from "@inertiajs/vue3";
import TheHeaderAvatarAndMoney from "./header/TheHeaderAvatarAndMoney.vue";

const page = usePage();
</script>
<template>
  <header class="flex z-[50] justify-between items-center w-full max-w-[1440px] mx-auto sm:px-4">
    <div class="nav-logo">
      <input type="checkbox" id="burger">
      <nav class="nav-burger">
        <li class="nav-burger__item"><a href="#">Товары</a></li>
        <li class="nav-burger__item"><a href="#">Рулетка</a></li>
        <li class="nav-burger__item"><Link href="/news">Новости</Link></li>
        <li class="nav-burger__item"><Link href="/about">О нас1</Link></li>
        <li class="nav-burger__item"><a href="#">Сообщество</a>`</li>
      </nav>
      <div class="header__logo">
        <Link class="logo__link" href="/">
          <img src="../../image/logo.svg" alt="Logo">
        </Link>
      </div>
    </div>

    <LangSelect />
    <div class="header-links">
      <a href="#" class="header-links-item">
        Товары
        <img src="../../image/icons/arrow.svg" alt="arrow">
      </a>
      <a href="#" class="header-links-item">Рулетка</a>
      <Link href="/news" class="header-links-item">Новости</Link>
      <Link href="/about" class="header-links-item">О нас</Link>
    </div>
    <div class="header__community">
      <img src="../../image/icons/societies.svg" alt="societies">
      <p class="header-community__title">Сообщество</p>
    </div>
    <div class="header__search">
      <img src="../../image/icons/search.svg" alt="search">
      <input class="bg-[#FFFFFF00] placeholder-[#C9C9C9] focus:ring-0" type="text" placeholder="Поиск">
    </div>
    <div class="header__profile">
      <div class="header-profile__currency">
        <p class="sm:hidden">$</p>
        <p class="sm:hidden">€</p>
        <p><span class="sm:hidden">₽</span></p>
      </div>
      <AuthSelect v-if="$page.props.auth === null" />
      <TheHeaderAvatarAndMoney v-else :user="$page.props.auth" />
    </div>
  </header>
</template>

<style>
</style>
