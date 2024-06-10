<script setup>
import RegisterDate from "../components/registerDate.vue";
import {Head, router, usePage} from "@inertiajs/vue3";
import Layout from "../components/layouts/layout.vue";
import UserAvatar from "../components/userAvatar.vue";
import Price from "../components/price.vue";
import Echo from "laravel-echo"
import io from 'socket.io-client';
import {ref} from "vue";
const props = defineProps(['product', 'user']);
const page = usePage();

let messages = ref([]);
let message = ref('');

window.io = io

const sendMessage = () => {
  const data = {
    to_user_id: props.user.id,
    message: message.value,
  };
  router.post('/chat/message', data, {
    forceFormData: true,

    // onSuccess: () => {
    //   router.visit('/profile');
    // }
  });

  messages.value.push(message.value)
  console.log(messages.value)
};


</script>

<template>
<Layout>
  <Head :title="product.name"/>

  <main class="chat w-full max-w-[1440px] mx-auto">
    <div class="chat__inner">
      <div class="chat-inner__chat">
        <div class="inner-chat__text">
          <div class="chat-text__title">{{ product.name }}</div>
          <div class="chat-text__text whitespace-pre-wrap">
            {{ product.description }}
          </div>
          <div class="chat-text__pay">
            <p class="text-pay__summ">
              <price :price="product.price" />
            </p>
            <div class="text-pay__select">
              <select name="" id="">
                <option value="">Способ оплаты</option>
                <option value="">Банковская карта</option>
                <option value="">Apple Pay</option>
                <option value="">Qiwi</option>
                <option value="">СБП</option>
                <option value="">Криптовалюта</option>
              </select>
              <button class="btn chat-btn">Оплатить</button>
            </div>
          </div>
        </div>
        <div class="inner-chat__chat-block">
          <div class="chat-block__header">
            <div class="seller__information">
              <UserAvatar class="h-[48px] w-[48px]" :user="user"/>
              <div class="seller__info">
                <div class="seller-info__name">{{ user.login }}</div>
                <div class="seller-info__state flex items-center">
                  <div class="state__rate">
                    <img src="../../image/icons/Star.svg" alt="">
                    0
                  </div>
                  <div class="state__year">
                    <RegisterDate :date="user.created_at" />
                    на сайте
                  </div>
                </div>
              </div>
            </div>
            <hr style="max-width: 712px; background-color: rgba(255, 255, 255, 0.05); height: 1px;">
          </div>
          <div class="chat-block__main">
            <div class="chat-main__block">
              <img src="../../image/image/chat.svg" alt="">
              <p>Напишите продавцу перед оплатой</p>
            </div>
          </div>
          <div class="chat-block__input">
            <label for="" class="relative">
              <input v-model="message" @keyup.enter="sendMessage" class="relative w-full bg-[#2E2E34] rounded-[15px] p-[20px]" type="text" placeholder="Напишите сообщение...">
              <div class="input-label__btns absolute top-[-2px] right-[20px]">
                <button class="chat-input__file-btn">
                  <img src="../../image/icons/file.png" alt="">
                </button>
                <button @click="sendMessage" class="chat-input__send-btn">
                  <img src="../../image/icons/send.svg" alt="">
                </button>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="chat-inner__reviews">
        <div class="inner__reviews-title">Отзывы</div>
        <div class="inner-reviews__state">
          <div class="reviews-state__rate">
            <p class="state-rate__title">0</p>
            <p class="state-rate__subtitle">На основе 0 отзывов</p>
          </div>
          <div class="reviews-state__statistic">
            <div class="statistic__lines">
              <div class="statistic-lines__stars">
                <p>5 звезд</p>
              </div>
              <div class="statistic-lines__box">
<!--                <div class="lines-box__item"></div>-->
              </div>
              <div class="statistic-lines__amount">0</div>
            </div>
            <div class="statistic__lines">
              <div class="statistic__lines">
                <div class="statistic-lines__stars">
                  <p>4 звезды</p>
                </div>
                <div class="statistic-lines__box">
<!--                  <div class="lines-box__item"></div>-->
                </div>
                <div class="statistic-lines__amount">0</div>
              </div>
            </div>
            <div class="statistic__lines">
              <div class="statistic__lines">
                <div class="statistic-lines__stars">
                  <p>3 звезды</p>
                </div>
                <div class="statistic-lines__box">
<!--                  <div class="lines-box__item"></div>-->
                </div>
                <div class="statistic-lines__amount">0</div>
              </div>
            </div>
            <div class="statistic__lines">
              <div class="statistic__lines">
                <div class="statistic-lines__stars">
                  <p>2 звезды</p>
                </div>
                <div class="statistic-lines__box">
<!--                  <div class="lines-box__item"></div>-->
                </div>
                <div class="statistic-lines__amount">0</div>
              </div>
            </div>
            <div class="statistic__lines">
              <div class="statistic__lines">
                <div class="statistic-lines__stars">
                  <p>1 звезда</p>
                </div>
                <div class="statistic-lines__box">
<!--                  <div class="lines-box__item"></div>-->
                </div>
                <div class="statistic-lines__amount">0</div>
              </div>
            </div>
          </div>
        </div>
        <div class="inner-reviews__comments">
<!--          <div class="comments-box__profile">-->
<!--            <img src="../../image/image/profile.svg" alt="" class="profile-comments">-->
<!--            <div class="box-comment__title">-->
<!--              <div class="comment-title__name-profile">FatherofNations</div>-->
<!--              <div class="comment-title__rate">-->
<!--                <div class="title-rate__stars">-->
<!--                  <img src="../../image/icons/grade-24px 4.svg" alt="">-->
<!--                  <img src="../../image/icons/grade-24px 4.svg" alt="">-->
<!--                  <img src="../../image/icons/grade-24px 4.svg" alt="">-->
<!--                  <img src="../../image/icons/grade-24px 4.svg" alt="">-->
<!--                  <img src="../../image/icons/grade-24px 5.svg" alt="">-->
<!--                </div>-->
<!--                <div class="title-rate__date">Вчера, 21:30</div>-->
<!--              </div>-->
<!--              <div class="box-comment__text">-->
<!--                Отличная игра жанра МОВА-Шутер. Доступность, не нужно платить сверху, держит в напряжении. Что еще нужно? Кто-то плачет про буст и троллинг? Жаль что вы не знаете что такое мут и руки. Всех кого бустят в любом случае упадут. Рейтинговая система меня вполне устраивает, во всех МОВА намного больший разброс. Доната нету, имею 300+ лвл и открыл все скины которые хотел и имею при этом 5к голды на ивент. В рейтинге - Золото, но и играю соответствующе. Поэтому игра отличная. Ивентов много, скины иногда топ. Для игры с друзьями самое то. Игру рекомендую на 100%-->
<!--                <hr style="margin-top: 28.2px; max-width: 621px; border: 0.85px solid rgba(255, 255, 255, 0.19)">-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
        </div>
      </div>
    </div>
  </main>

</Layout>
</template>

<style scoped>

</style>
