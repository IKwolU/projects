<script setup>
import {reactive, ref} from 'vue'
import {router} from '@inertiajs/vue3'
import ClosePopUpButton from "@/components/closePopUpButton.vue";

let showModalState = ref(false);
let modalTitle = ref('');

const emit = defineEmits(['close', 'openRegister', 'authType']);
const props = defineProps(['authType', 'openRegister', 'errors']);
let form = reactive({
  email: ref(''),
  password: ref('')
})

function close() {
  emit('close');
}
function auth() {
  switch (props.authType) {
    case 0:
      router.post('/registration', {'email': form.email, 'password': form.password}, {
        preserveState: (page) => Object.keys(page.props.errors).length
      })
      break;
    case 1:
      router.post('/login', {'email': form.email, 'password': form.password}, {
        preserveState: (page) => Object.keys(page.props.errors).length
      })
      break;
  }
}
</script>
<template>

  <teleport to="body">
    <Transition>
      <div v-if="openRegister"
           class="fixed inset-0 z-50 top-0 bg-black bg-opacity-60 backdrop-blur flex justify-center items-center">
        <div class="popup-register-inner">
          <div class="popup-items">
            <div class="btn-popup">
              <div :class="[ authType === 1 ? 'sign-in-active' : 'sign-in']">
                <p @click="authType = 1" class="login-link cursor-pointer">Вход</p>
              </div>
              <div :class="[ authType === 0 ? 'sign-in-active' : 'sign-in']">
                <p @click="authType = 0" class="register-link cursor-pointer">Регистрация</p>
              </div>
            </div>
            <form @submit.prevent="auth()" method="post">
              <label class="bg-[#2C2C2C] rounded-[6px] py-[5px] px-[16px]" for="email">
                <div class="mt-1 text-[#A5A5A5]">E-mail</div>
                <input class="p-0 bg-[#2C2C2C] h-[15px]" v-model="form.email" type="text" name="email" placeholder="">

              </label>
              <p v-if="$page.props.errors.email"
                 style="color: #e04a4a; font-size: 12px; margin-top: -10px;">
                {{ $page.props.errors.email }}</p>
              <label CLASS="bg-[#2C2C2C] rounded-[6px] py-[5px] px-[16px]" for="password">
                <div class="mt-1 text-[#A5A5A5]">Пароль</div>
                <input class="p-0 bg-[#2C2C2C] h-[15px]" v-model="form.password" type="password" name="password"
                       placeholder="">

              </label>
              <p v-if="$page.props.errors.password"
                 style="color: #e04a4a; font-size: 12px; margin-top: -10px;">
                {{ $page.props.errors.password }}</p>
              <div class="button-box">
                <button type="submit" :class="[authType === 0 ? 'btn-register' : 'btn-authorize']">
                  <span v-if="authType === 0">Зарегистрироваться</span>
                  <span v-if="authType === 1">Войти</span>
                </button>
                <a v-if="authType === 1" class="lost-password">Забыли пароль?</a>
              </div>
            </form>
            <div class="social-media">
              <p class="social-media_text font-Rubik">
                Войти с помощью
              </p>
              <div class="social-media_items flex items-center">
                <a href="/login/steam"><img src="../../image/icons/steam.svg" alt=""
                                            class="social-media_icon steam"></a>
                <a href="/login/google"><img src="../../image/icons/google.svg" alt="" class="social-media_icon google"></a>
                <a href="/login/vk"><img src="../../image/icons/vkontakte.svg" alt=""
                                         class="social-media_icon vkontakte"></a>
                <a href="/login/facebook"><img src="../../image/icons/facebook.svg" alt=""
                                               class="social-media_icon facebook"></a>
              </div>
            </div>
            <ClosePopUpButton @click="close()"/>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style scoped>
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #2c2c2c inset;
  -webkit-text-fill-color: white !important;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
  opacity: 100;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* Попап входа */

.wrapper {
  position: relative;
  width: 100%;
  height: 100vh;

  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.open-popup a {
  display: inline-block;
  background-color: black;
  padding: 15px 30px;
  color: #2C2C2C;
  text-decoration: none;
}

#popup {
  position: fixed;
  flex-direction: column;
  column-gap: 18px;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .7);
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
  opacity: 0;
  visibility: visible;
}


.popup-inner {
  margin-top: 191px;
  margin-bottom: 414px;
  margin-left: 646px;
  margin-right: 645px;
  border-radius: 47px;
  position: relative;
  background-color: black;
  width: 608px;
  height: 464px;
  -webkit-transition: all .5s ease;
  -o-transition: all .5s ease;
  transition: all .5s ease;
}


.btn-popup {
  font-family: "Rubik";
  font-size: 37px;

  display: flex;
  gap: 13px;
}

.popup-items {
  padding-top: 58px;
  padding-bottom: 59px;
  padding-right: 107px;
  padding-left: 63px;
  margin-bottom: 19px;
  display: flex;
  flex-direction: column;
  gap: 19px;
}

.authorize {
  display: flex;
  align-items: left;

  color: #fff;
  text-decoration: none;
  font-size: 37px;
}

.sign-in-active {
  margin-right: 20px;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
}

.sign-in {
  text-decoration: none;
  margin-right: 20px;
  text-decoration: none;
  color: #fff;
}

.sign-up {
  text-decoration: none;
  margin-right: 20px;
  text-decoration: none;
  color: #fff;
}

.sign-up-active {
  margin-right: 20px;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
}

a:visited {
  color: #fff;
}

a.close-popup {
  display: flex;
  position: absolute;
  text-align: center;
  line-height: 40px;

  top: -3%;
  right: -3%;

  text-decoration: none;
}

form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.main-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 438px;
  height: 196px;
}


#comm {
  width: 490px;
  height: 132px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #000;
}

.button-box {
  width: 263px;
}

.btn-authorize {
  text-align: center;
  margin-right: 21px;

  width: 112px;
  height: 48px;
  padding: 14px 33px 14px 33px;
  border-radius: 6px;

  background-color: rgba(245, 149, 2, 1);
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  color: #fff;
}

.lost-password {
  height: 19px;
  width: 128px;
  padding: 0px;

  text-decoration: none;
  font-size: 16px;
  color: #6A6A6A;
}

.social-media_text {
  color: #6A6A6A;
  font-size: 16px;
  margin-bottom: 8px;
}

.social-media_items {
  display: flex;
  gap: 24px;
}

/* Попап регистрации */

#popup-register {
  position: fixed;
  flex-direction: column;
  column-gap: 18px;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .7);
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
  opacity: 0;
  visibility: visible;
}

.popup-register-inner {
  border-radius: 47px;
  position: relative;
  background-color: black;
  width: 608px;
  height: 464px;
  -webkit-transition: all .5s ease;
  -o-transition: all .5s ease;
  transition: all .5s ease;
}

a.close-popup-register {
  display: flex;
  position: absolute;
  text-align: center;
  line-height: 40px;

  top: -3%;
  right: -3%;

  text-decoration: none;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 438px;
  height: 196px;
}

.btn-register {
  width: 222px;
  height: 48px;
  padding: 14px 33px 14px 33px;
  border-radius: 6px;

  background-color: rgba(245, 149, 2, 1);
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  color: #fff;
}

/* Попап восстановления пароля */

#popup-password {
  position: fixed;
  flex-direction: column;
  column-gap: 18px;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .7);
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
  opacity: 0;
  opacity: 1;
  visibility: visible;
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
  transform: scale(1);
}


.popup-password-inner {
  margin-top: 58px;
  margin-bottom: 50px;
  margin-left: 63px;
  margin-right: 83px;
  border-radius: 47px;
  position: relative;
  background-color: black;
  width: 608px;
  height: 366px;
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  -o-transform: scale(0);
  transform: scale(0);
  -webkit-transition: all .5s ease;
  -o-transition: all .5s ease;
  transition: all .5s ease;
}

a.popup-close-password {
  display: flex;
  position: absolute;
  text-align: center;
  line-height: 40px;

  top: -3%;
  right: -3%;

  text-decoration: none;
}

.popup-password-items {
  padding-top: 58px;
  padding-bottom: 50px;
  padding-right: 83px;
  padding-left: 63px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.btn-password {
  display: block;
  width: 222px;
  height: 48px;
  padding: 14px 33px 14px 33px;
  border-radius: 6px;

  background-color: rgba(245, 149, 2, 1);
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  color: #fff;
}

.button-box-password {
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 438px;
  height: 122px;
}

.main-text-password {
  color: #fff;
  line-height: 44.84px;
  font-weight: 700;
  font-family: "Rubik";
  font-size: 37px;
}

.subtext-password {
  width: 414px;
  height: 52px;
  color: #fff;
  font-weight: 400;
  font-family: "Rubik";
  font-size: 20px;
}

/* Попап для покупки */

#popup-pay {
  position: fixed;
  flex-direction: column;
  column-gap: 18px;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .7);
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
  opacity: 0;
  opacity: 1;
  visibility: visible;
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
  transform: scale(1);
}

.popup-pay-inner {
  margin-top: 58px;
  margin-bottom: 54px;
  margin-left: 63px;
  margin-right: 63px;
  border-radius: 47px;
  position: relative;
  background-color: black;
  width: 608px;
  height: 472px;
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  -o-transform: scale(0);
  transform: scale(0);
  -webkit-transition: all .5s ease;
  -o-transition: all .5s ease;
  transition: all .5s ease;
}

a.popup-close-pay {
  display: flex;
  position: absolute;
  text-align: center;
  line-height: 40px;

  top: -3%;
  right: -3%;

  text-decoration: none;
}

.popup-pay-items {
  padding-top: 58px;
  padding-bottom: 50px;
  padding-right: 83px;
  padding-left: 63px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.btn-pay {
  width: 162px;
  height: 56px;
  padding: 14px 33px 14px 33px;
  border-radius: 6px;

  background-color: rgba(245, 149, 2, 1);
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  color: #fff;
}

.pay-form label {
  width: 482px;
}

.pay-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 483px;
  height: 196px;
}

.main-text-pay {
  color: #fff;
  line-height: 44.84px;
  font-weight: 700;
  font-family: "Rubik";
  font-size: 37px;
}

.subtext-box {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.subtext-pay {
  width: 414px;
  height: 52px;
  color: #fff;
  font-weight: 400;
  font-family: "Rubik";
  font-size: 20px;
}

.pay-wallet {
  width: 482px;
  height: 62px;
  display: flex;
  gap: 12px;
}

.wallet {
  width: 71px;
  height: 32px;
}

.paypal-wallet {
  border-width: 3px;
  border-color: #F59502;
  border-style: solid;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 152px;
  height: 62px;
  padding: 16px, 24px, 16px, 24px;
  border-radius: 6px;
  background-color: #191919;
}

#money {
  padding-top: 0px;
  width: 482px;
  height: 56px;
}

.qiwi-wallet {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 152px;
  height: 62px;
  padding: 16px, 24px, 16px, 24px;
  border-radius: 6px;
  background-color: #191919;
}

.payeer-wallet {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 153px;
  height: 62px;
  padding: 16px, 24px, 16px, 24px;
  border-radius: 6px;
  background-color: #191919;
}

/* Попап со сменой пароля */

#popup-reset {
  position: fixed;
  flex-direction: column;
  column-gap: 18px;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .7);
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  opacity: 1;
  visibility: visible;
}


.popup-reset-inner {
  margin-top: 41px;
  margin-bottom: 58px;
  margin-left: 63px;
  margin-right: 107px;
  border-radius: 47px;
  position: relative;
  background-color: black;
  width: 608px;
  height: 363px;
  -webkit-transition: all .5s ease;
  -o-transition: all .5s ease;
  transition: all .5s ease;
}

a.popup-close-reset {
  display: flex;
  position: absolute;
  text-align: center;
  line-height: 40px;

  top: -3%;
  right: -3%;

  text-decoration: none;
}

.popup-reset-items {
  padding-top: 47px;
  padding-bottom: 58px;
  padding-right: 105px;
  padding-left: 63px;
  display: flex;
  flex-direction: column;
  gap: 23px;
}

.btn-reset {

  width: 190px;
  height: 48px;
  padding: 14px 33px 14px 33px;
  border-radius: 6px;

  background-color: rgba(245, 149, 2, 1);
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  font-family: "Roboto";
  color: #fff;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 18px;

  width: 493px;
  height: 258px;
}

.main-text-reset {
  color: #fff;
  line-height: 44.84px;
  font-weight: 700;
  font-family: "Rubik";
  font-size: 37px;
}

/* Страница входа - адаптив */

@media (max-width: 620px) {
  .popup-inner {
    width: 508px;
    height: 364px;
  }

  .btn-popup {
    font-size: 27px;
  }


  .btn-authorize {
    width: 102px;
    height: 38px;
    font-size: 14px;
    padding: 11px 30px 11px 30px;
  }

  .lost-password {
    height: 17px;
    width: 126px;
    font-size: 14px;
  }

  .social-media {
    height: 46px;
    width: 328px;
  }

  .steam {
    height: 27px;
    width: 25px;
  }

  .google {
    height: 27px;
    width: 25px;
  }

  .vkontakte {
    height: 27px;
    width: 39px;
  }

  .facebook {
    height: 27px;
    width: 13px;
  }

  .popup-items {
    padding-top: 45px;
    padding-bottom: 47px;
    padding-right: 95px;
    padding-left: 50px;
  }
}

@media (max-width: 896px) {
  .popup-inner {
    width: 508px;
    height: 364px;
  }

  .btn-popup {
    font-size: 27px;
  }


  .btn-authorize {
    width: 102px;
    height: 38px;
    font-size: 14px;
    padding: 11px 30px 11px 30px;
  }

  .lost-password {
    height: 17px;
    width: 126px;
    font-size: 14px;
  }

  .social-media {
    height: 46px;
    width: 328px;
  }

  .steam {
    height: 27px;
    width: 25px;
  }

  .google {
    height: 27px;
    width: 25px;
  }

  .vkontakte {
    height: 27px;
    width: 39px;
  }

  .facebook {
    height: 27px;
    width: 13px;
  }

  .popup-items {
    padding-top: 45px;
    padding-bottom: 47px;
    padding-right: 95px;
    padding-left: 50px;
  }
}

/* Страница регистрации - адаптив */

@media (max-width: 620px) {
  .popup-register-inner {
    width: 508px;
    height: 364px;
  }

  .btn-popup {
    font-size: 27px;
  }


  .btn-register {
    width: 212px;
    height: 38px;
    font-size: 14px;
    padding: 10px 30px 10px 30px;
  }

  .social-media {
    height: 46px;
    width: 328px;
  }

  .steam {
    height: 27px;
    width: 25px;
  }

  .google {
    height: 27px;
    width: 25px;
  }

  .vkontakte {
    height: 27px;
    width: 39px;
  }

  .facebook {
    height: 27px;
    width: 13px;
  }

  .popup-items {
    padding-top: 45px;
    padding-bottom: 47px;
    padding-right: 95px;
    padding-left: 50px;
  }
}

@media (max-width: 896px) {
  .popup-register-inner {
    width: 508px;
    height: 364px;
  }

  .btn-popup {
    font-size: 27px;
  }

  .btn-register {
    width: 212px;
    height: 38px;
    font-size: 14px;
    padding: 10px 30px 10px 30px;
  }

  .social-media {
    height: 46px;
    width: 328px;
  }

  .steam {
    height: 27px;
    width: 25px;
  }

  .google {
    height: 27px;
    width: 25px;
  }

  .vkontakte {
    height: 27px;
    width: 39px;
  }

  .facebook {
    height: 27px;
    width: 13px;
  }

  .popup-items {
    padding-top: 45px;
    padding-bottom: 47px;
    padding-right: 95px;
    padding-left: 50px;
  }
}


</style>
