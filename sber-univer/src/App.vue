<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AudioPlayer from './components/AudioPlayer.vue'
import { format } from 'date-fns';
import Locations from './structure.ts';

function getImagePathByDecimalSeconds(seconds: number, imageDict): string {
  const totalMinutes = Math.floor(seconds / 60);
  const secondsAsInt = Math.round(seconds) % 60;
  // Convert decimal seconds to hours and minutes
  const timeThingy = new Date(2000, 0, 1, 0, totalMinutes, secondsAsInt);
  const time = format(timeThingy, 'mm:ss');

  // Get the keys (times) from the image dictionary
  const times = Object.keys(imageDict);

  // Sort the times in ascending order
  times.sort();

  // Find the nearest time in the dictionary
  let nearestTime = times[0];
  for (let i = 1; i < times.length; i++) {
    if (times[i] > time) {
      break;
    }
    nearestTime = times[i];
  }

  // Get the image path corresponding to the nearest time
  const imagePath = imageDict[nearestTime];

  return imagePath;
}

type LocationData = typeof Locations[0];

const player = ref()
const activeLocation = ref<LocationData | undefined>();

const currentImageUrl = ref()

const handleMapClick = () => {
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const locationId = urlParams.get('id');
  if (locationId) {
    activeLocation.value = Locations.find((loc: LocationData) => loc.id === Number(locationId));
  }
});

const handleBubbleClick = (location: LocationData) => {
  activeLocation.value = location;
  currentImageUrl.value = Object.values(location.timestamps)[0];
  // player.value.play()
};

const returnToMap = () => {
  activeLocation.value = undefined;
  currentImageUrl.value = undefined;
};

const onTimeChanged = (time: number) => {
  // const modal = ref<InstanceType<typeof AudioPlayer> | null>(null);
  // player.value.pause()
  const relevantImageUrl = getImagePathByDecimalSeconds(time, activeLocation.value!.timestamps);
  if (relevantImageUrl !== currentImageUrl.value) {
    currentImageUrl.value = relevantImageUrl;
  }
  console.log(relevantImageUrl);
};

</script>

<template>
  <div v-if="!!activeLocation" v-bind:class="'absolute top-0 left-0 w-full h-full bg-white z-50'">

    <div class="relative w-full h-60">
      <img v-for="(url, time) in activeLocation.timestamps" :key="time" v-bind:src="'assets/' + url" :class="{
    'opacity-100 duration-500': currentImageUrl === url,
    'opacity-0 duration-1000': currentImageUrl !== url,
    'absolute top-0 left-0 transition-all w-full z-50': true,
    'h-60 cover': true
  }" />
    </div>

    <h2>{{ activeLocation.locationName }}</h2>

    <div v-bind:class="'px-8'">
      <div v-bind:class="'mb-12'">
        <AudioPlayer ref="player" v-on:onTimeChanged="onTimeChanged" :track-url="activeLocation.audio" />
      </div>
      <!-- <button @click="kek">rrrr</button> -->

      <div v-bind:class="'rounded p-4 space-y-2 bg-blue-100'">
        <h2>Знаете ли вы, что:</h2>


        <div v-bind:class="'h-40 overflow-scroll'">
          <div v-for="fact in activeLocation.facts" :key="fact" v-bind:class="'text-slate-800  '">
            {{ fact }}
          </div>
        </div>

        <div v-bind:class="'rounded p-4 space-y-2'">
          <h2>Вы на карте:</h2>
          <img src="/assets/main-map.jpg" @click="handleMapClick" v-bind:class="'rounded h-32 rotate-90'" />
        </div>
      </div>




      <div v-bind:class="'rounded p-4 space-y-2'">
        <div v-bind:class="'flex space-between'">
          <h2>Локации рядом:</h2>
          <div @click="returnToMap">К началу экскурсии</div>
        </div>
        <div v-for="nearbyLoc in activeLocation.nearbyLocations" :key="nearbyLoc"
          v-bind:class="'w-1/3 bg-red-300 flex justify-center flex-col items-center'">
          <img src="/assets/main-map.jpg" @click="handleMapClick" v-bind:class="'rounded h-20'" />
          <div> {{ Locations.find((loc: LocationData) => loc.id === nearbyLoc)?.locationName }}</div>
        </div>
      </div>

    </div>


  </div>
  <div>
    <img src="/assets/main-map.jpg" alt="Map Image" @click="handleMapClick" style="position: relative; width: 100%;" />
    <div v-for="bubble in Locations" :key="bubble.locationName" @click="handleBubbleClick(bubble)" :style="{
    position: 'absolute',
    left: bubble.coords.x + '%',
    top: bubble.coords.y + '%',
    width: '20px',
    height: '20px',
    background: 'red',
    borderRadius: '50%',
    cursor: 'pointer'
  }"></div>
  </div>
</template>