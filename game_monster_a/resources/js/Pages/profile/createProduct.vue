<script setup>
import Layout from "../../components/layouts/layout.vue";
import {Head, Link, router, usePage} from "@inertiajs/vue3";
import {ref} from "vue";

const props = defineProps(['games']);
const page = usePage();

let timeRange = ref(0);
let type = ref(0);
let time = ref(0);
let count = ref();
const getPolishing = timeLocal => {
  if (typeof timeLocal !== 'number') {
    timeLocal = parseInt(timeLocal);
  }
  const t = parseInt(timeLocal);
  if (typeof timeLocal !== 'number' || isNaN(t)) {
    time.value = 0;
    timeRange = 0;
    return;
  }
  if (Number(timeLocal) > 168) {
    timeLocal = 168;
  }
  let number = Number(timeLocal);
  const titles = ['Час', 'Часа', 'Часов'];
  const cases = [2, 0, 1, 1, 1, 2];
  time.value = timeLocal + ' ' + `${titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]]}`;
  number = parseInt(time.value);
  timeRange.value = number;
}


let game_id = ref(null);
let name = ref();
let description = ref();
let price = ref();
let category = ref(null);
let podCategory = ref(null)

const sendData = () => {
  const data = {
    type: type.value,
    user_id: page.props.auth.id,
    game_id: game_id.value,
    name: name.value,
    description: description.value,
    price: price.value,
    count: count.value,
    shutdownTime: timeRange.value,
    category: category.value,
    podCategory: podCategory.value
  };
  router.post('/profile/create-product', data, {
    forceFormData: true,
    onSuccess: () => {
      router.visit('/profile');
    }
  });
};

const getGameById = id => {
  let data = props.games.filter(game => game.id === id);
  return data[0].categories;
};

const getGameByIdPodCategories = id => {
  let data = props.games.filter(game => game.id === id);
  return data[0].categories[category.value].podCategories;
}

const checkPrice = () => {
  if (price.value > 1000000) {
    price.value = 1000000
  }
}
</script>

<template>
  <Head title="Создание товара"/>
  <Layout>
    <main class="w-full h-full flex justify-center items-center">
      <div class="w-[514px] flex flex-col sm:px-4">
        <Link href="/profile">
          <div class="flex gap-2 items-center hover:underline cursor-pointer">
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M5.9553 10.2458C6.14155 10.0584 6.24609 9.80498 6.24609 9.5408C6.24609 9.27661 6.14155 9.02316 5.9553 8.8358L2.4153 5.2458L5.9553 1.7058C6.14155 1.51844 6.24609 1.26498 6.24609 1.0008C6.24609 0.736612 6.14155 0.483161 5.9553 0.295798C5.86234 0.20207 5.75174 0.127675 5.62988 0.0769067C5.50802 0.026138 5.37731 -3.79756e-08 5.2453 -4.3746e-08C5.11329 -4.95165e-08 4.98258 0.0261379 4.86072 0.0769066C4.73887 0.127675 4.62826 0.20207 4.5353 0.295798L0.295301 4.5358C0.201572 4.62876 0.127178 4.73936 0.0764093 4.86122C0.0256407 4.98308 -0.000497833 5.11379 -0.000497838 5.2458C-0.000497844 5.37781 0.0256406 5.50852 0.0764093 5.63037C0.127178 5.75223 0.201572 5.86283 0.2953 5.9558L4.5353 10.2458C4.62826 10.3395 4.73886 10.4139 4.86072 10.4647C4.98258 10.5155 5.11329 10.5416 5.2453 10.5416C5.37731 10.5416 5.50802 10.5155 5.62988 10.4647C5.75174 10.4139 5.86234 10.3395 5.9553 10.2458Z"
                  fill="#5B5962"/>
            </svg>
            <p class="text-[16px] text-[#5B5962]">Назад</p>
          </div>
        </Link>
        <p class="text-[36px] font-bold mt-[18px]">Создание товара</p>
        <div class="mt-[28px] flex flex-col gap-[20px]">
          <div class="bg-[#2C2C2C] rounded-[6px] p-[6px] flex">
            <div @click="type = 0" :class="{'bg-[#4B4C4E]' : type === 0}"
                 class="rounded-[6px] transition-all cursor-pointer flex flex-1 justify-center items-center p-[12px]">
              <p>Товар</p>
            </div>
            <div @click="type = 1" :class="{'bg-[#4B4C4E]' : type === 1}"
                 class="flex-1 transition-all flex rounded-[6px] cursor-pointer justify-center items-center">
              <p>Услуга</p>
            </div>
          </div>

          <select v-model="game_id" class="bg-[#2C2C2C] cursor-pointer text-white rounded-[6px] w-full">
            <option selected :value="null">Игра не выбрана</option>
            <option v-for="game in games" :value="game.id">{{ game.name.title_ru }}</option>
          </select>

          <select v-model="category" class="bg-[#2C2C2C] cursor-pointer text-white rounded-[6px] w-full">
            <option selected :value="null">Категория не выбрана</option>
            <option
                v-if="game_id !== null"
                v-for="(category, index) in getGameById(game_id)"
                :value="index"
            >
              {{ category.name[0] }}
            </option>
          </select>

          <select v-model="podCategory" v-if="category !== null"
                  class="bg-[#2C2C2C] cursor-pointer text-white rounded-[6px] w-full">
            <option selected :value="null">Подкатегория не выбрана</option>
            <option
                v-if="game_id !== null"
                v-for="(lCategory, index) in getGameByIdPodCategories(game_id)"
                :value="index"
            >
              {{ lCategory[0] }}
            </option>
          </select>

          <input v-model="name" class="rounded-[6px] w-full placeholder-[#A5A5A5] bg-[#2C2C2C]"
                 placeholder="Название товара" type="text">
          <p v-if="$page.props.errors.name" class="text-red-500 text-[12px] mt-[-10px]">
            {{ $page.props.errors.name }}
          </p>
          <textarea v-model="description" class="rounded-[6px] w-full placeholder-[#A5A5A5] bg-[#2C2C2C] h-[164px]"
                    placeholder="Описание"></textarea>
          <p v-if="$page.props.errors.description" class="text-red-500 text-[12px] mt-[-10px]">
            {{ $page.props.errors.description }}
          </p>
          <div v-if="type === 1" class="w-full relative">
            <input v-model="time" @change="getPolishing(time)"
                   class="rounded-[6px] w-full pr-[37px] pt-[25px] placeholder-[#A5A5A5] bg-[#2C2C2C]" type="text">
            <div class="absolute top-[30px] pointer-events-none">
              <input v-model="timeRange" @change="getPolishing(timeRange)" step="1" max="168"
                     class="min-w-[514px] w-full h-0 appearance-none cursor-pointer pointer-events-auto" type="range">
            </div>
            <p class="absolute text-[#A5A5A5] top-[7px] left-[12px] text-[12px]">Длительность</p>
            <p v-if="$page.props.errors.time" class="text-red-500 text-[12px] mt-[-10px]">
              {{ $page.props.errors.time }}
            </p>
          </div>
          <div class="w-full relative">
            <input @change="checkPrice()" maxlength="7" v-model="price"
                   class="rounded-[6px] w-full pr-[37px] placeholder-[#A5A5A5] bg-[#2C2C2C]"
                   placeholder="Стоимость" type="number">
            <p class="absolute right-[12px] top-[5px] text-[#7C7C7C] text-[20px]">₽</p>
            <p v-if="$page.props.errors.price" class="text-red-500 text-[12px]">
              {{ $page.props.errors.price }}
            </p>
          </div>
          <div class="w-full relative">
            <input v-model="count" class="rounded-[6px] w-full pr-[37px] placeholder-[#A5A5A5] bg-[#2C2C2C]"
                   placeholder="Количество товара" type="number">
            <p v-if="$page.props.errors.count" class="text-red-500 text-[12px]">
              {{ $page.props.errors.count }}
            </p>
          </div>
          <button @click="sendData()" class="bg-c_orange rounded-[6px] py-[18px] hover:opacity-70 transition-all">
            Создать
          </button>
        </div>
      </div>
    </main>
  </Layout>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='range']::-webkit-slider-thumb {
  background: #F59502;
}
</style>
