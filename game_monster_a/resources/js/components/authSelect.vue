<template>
    <div class="auth-block pc-fade">
        <div class="auth-block pc-fade">
            <div @click="authType = 1; openRegister = true;" class="vhod" style="cursor: pointer;">Вход</div>
            <span>/</span>
            <div @click="authType = 0; openRegister = true;" class="register" style="cursor: pointer;">Регистрация</div>
        </div>
        <div @click="authType = 1; openRegister = true;" class="mob-fade mob-button-auth" style="cursor: pointer;">Вход</div>
    </div>
    <AuthPopUp
        :openRegister="openRegister"
        :authType="authType"
        @close="close()"
    />
</template>

<script>
import {defineComponent} from 'vue'
import AuthPopUp from "@/components/authPopUp.vue";

export default defineComponent({
    name: "AuthSelect",
    components: {
        AuthPopUp
    },
    data() {
        return {
            authType: 0,
            openRegister: false
        }
    },
    methods:{
        close(){
            this.openRegister = false;
        }
    }
})
</script>
