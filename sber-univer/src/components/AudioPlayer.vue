<script>
import AudioPlayer from "@liripeng/vue-audio-player";

export default {
    components: {
        AudioPlayer,
    },
    expose: ['pause', 'play'],
    emits: ['onTimeChanged'],
    props: ['trackUrl'],
    setup(props) {
    },
    data({ $props }) {
        return {
            audio: [$props.trackUrl]
        };
    },

    mounted() {
        this.$nextTick(() => {
            // this.$refs.audioPlayer.play();
        });
    },

    methods: {
        pause() {
            console.log(this.$refs.audioPlayer.$refs.audio.pause());
        },
        play() {
            console.log(this.$refs.audioPlayer.$refs.audio.play());
        },
        handleTimeUpdate() {
            this.$emit('onTimeChanged', this.$refs.audioPlayer.$refs.audio.currentTime);
        },
        // Use this function if you want to do something before you start playing
        //   handleBeforePlay(next) {
        //     this.title = this.audioList[this.$refs.audioPlayer.currentPlayIndex].name;

        //     next(); // Start play
        //   },

        //   handlePlaySpecify() {
        //     this.$refs.audioPlayer.currentPlayIndex = 1;
        //     this.$nextTick(() => {
        //       this.$refs.audioPlayer.play();
        //       this.title = this.audioList[
        //         this.$refs.audioPlayer.currentPlayIndex
        //       ].name;
        //     });
        //   },
    },
};
</script>
<template>
    <audio-player ref="audioPlayer" @timeupdate="handleTimeUpdate" :audio-list="audio" :show-prev-button="false"
        :show-volume-button="false" :show-next-button="false" :show-playback-rate="false" />

</template>
<style></style>