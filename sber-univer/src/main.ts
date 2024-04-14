import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import AudioPlayer from "@liripeng/vue-audio-player";

createApp(App).use(AudioPlayer).mount("#app");
