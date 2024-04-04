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
const previewedLocation = ref<LocationData | undefined>()
const activeLocation = ref<LocationData | undefined>();

const currentImageUrl = ref()
const blueBubbleExpanded = ref(false)

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const locationId = urlParams.get('id');
  if (locationId) {
    startTheJourney(Number(locationId))
  }
});

const handleBlueBubbleClick = () => { 
  blueBubbleExpanded.value = !blueBubbleExpanded.value;
};

const handleBubbleClick = (location: LocationData) => {
  if (!previewedLocation.value || previewedLocation.value.id !== location.id) {
    previewedLocation.value = location;
    return;
  }

  if (previewedLocation.value.id === location.id) {
    activeLocation.value = location;
    currentImageUrl.value = Object.values(location.timestamps)[0];
    return;
  }

  // player.value.play()
};

const returnToMap = () => {
  activeLocation.value = undefined;
  currentImageUrl.value = undefined;
};

const startTheJourney = (locationId: number = 1) => {
  const startingPoint = Locations.find(x => x.id === locationId)!;
  activeLocation.value = startingPoint;
  currentImageUrl.value = Object.values(startingPoint.timestamps)[0];
  previewedLocation.value = startingPoint;
};

const visitNearby = (nearbyLocId: number) => {
  window.location.href = window.location.origin + `/?id=${nearbyLocId}`;
};

const onTimeChanged = (time: number) => {
  // const modal = ref<InstanceType<typeof AudioPlayer> | null>(null);
  // player.value.pause()
  const relevantImageUrl = getImagePathByDecimalSeconds(time, activeLocation.value!.timestamps);
  if (relevantImageUrl !== currentImageUrl.value) {
    currentImageUrl.value = relevantImageUrl;
  }
};

</script>

<template>
  <div v-if="!!activeLocation" v-bind:class="'absolute top-0 left-0 w-full bg-white z-30'">

    <div class="relative w-full h-60 bg-top">
      <img v-for="(url, time) in activeLocation.timestamps" :key="time" v-bind:src="'assets/' + url" :class="{
    'opacity-100 duration-500': currentImageUrl === url,
    'opacity-0 duration-1000': currentImageUrl !== url,
    'absolute top-0 left-0 transition-all w-full': true,
    'h-60 contain': true
  }" />

      <div v-bind:class="'absolute w-full h-60 z-40 bg-top'" :class="{ '': true }"></div>
      <!-- <img v-bind:src="'assets/shablon-top.png'" v-bind:class="'absolute bottom-0 z-40'" /> -->
    </div>

    <!-- <img v-bind:src="'assets/shablon.png'" v-bind:class="'rounded-md absolute top-0 z-40'" /> -->

    <div v-bind:class="'px-8 z-50 bg pb-24 pt-12 text-center'" :class="{ '': true }">

      <h1>{{ activeLocation.locationName }}</h1>

      <div v-bind:class="''">
        <div v-bind:class="'mb-12'">
          <AudioPlayer ref="player" v-on:onTimeChanged="onTimeChanged" :track-url="activeLocation.audio" />
        </div>
        <!-- <button @click="kek">rrrr</button> -->

        <div v-bind:class="'rounded-xl p-4 pr-6 space-y-2 bg-white text-left'">
          <h2>Знаете ли вы, что:</h2>

          <div v-bind:class="'relative'">

            <div v-bind:class="'w-full h-16 absolute bottom-0 bg-gradient-to-t from-white to-white/30'">
            </div>

            <div v-bind:class="'h-44 overflow-y-scroll pb-4'">
              <div v-for=" fact  in  activeLocation.facts " :key="fact"
                v-bind:class="'text-slate-800 border-b border-b-lime-300 mb-5 text-sm pb-1'">
                {{ fact }}
              </div>
            </div>
          </div>

          <div v-bind:class="'rounded space-y-2'">
            <h2>Вы на карте:</h2>
            <img v-bind:src="activeLocation.miniMap" @click="returnToMap" v-bind:class="'rounded-md'" />
          </div>
        </div>




        <div v-bind:class="'rounded space-y-2 mt-4'">
          <div v-bind:class="'flex justify-between w-full'">
            <h2>Локации рядом:</h2>
            <span v-if="activeLocation.id !== 1" v-bind:class="'text-sm text-sky-400 underline'"
              @click="startTheJourney()">К началу экскурсии</span>
          </div>
          <div v-bind:class="'flex space-between space-x-2'">
            <div v-for=" nearbyLocId  in  activeLocation.nearbyLocations " :key="nearbyLocId"
              @click="visitNearby(nearbyLocId)"
              v-bind:class="'w-1/3 bg-white p-1 rounded-xl flex flex-col items-center justify-start'">
              <img v-bind:src="'/assets/' + Locations.find(x => x.id === nearbyLocId)?.icon"
                v-bind:class="'rounded w-8 h-8'" />
              <div v-bind:class="'h-8 flex items-center'">
                <div v-bind:class="'text-xs'">
                  {{ Locations.find((loc: LocationData) => loc.id === nearbyLocId)?.locationName }}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  <div v-if="!activeLocation">
    <img src="/assets/main-map.webp" alt="Map Image" style="position: relative; width: 100%;" />


    <div v-for=" bubble  in  Locations.filter(x => !!x.coords) " :key="bubble.locationName"
      @click="handleBubbleClick(bubble)" :style="{
    position: 'absolute',
    left: bubble.coords!.x + '%',
    top: bubble.coords!.y + '%',
    width: '48px',
    height: '48px',
    background: 'white',
    borderRadius: '50%',
    cursor: 'pointer'
  }" v-bind:class="'flex justify-center items-center'">

      <div :class="{
    'absolute top-0 left-0 py-1 pl-14 pr-6 rounded-full bg-green opacity-0 transition-all text-white border-2 border-white': true,
    'h-12 opacity-100 duration-300': previewedLocation?.id === bubble.id,
    'hidden': previewedLocation?.id !== bubble.id,
  }" v-bind:class="'text-center text-sb-display-semi-bold text-sm flex items-center'">
        {{ bubble.mapLocationName || bubble.locationName }}
      </div>

      <div v-bind:class="'flex justify-center items-center bg-green w-11 h-11 rounded-full relative'">
        <div v-bind:class="'flex justify-center items-center bg-white w-9 h-9 rounded-full'">
          <div :class="{
    [`bg-green w-7 h-7 rounded-full flex justify-center
           items-center text-white text-sb-display-bold`]: true
  }">
            {{ bubble.id }}
          </div>
        </div>
      </div>
    </div>


    <div @click="handleBlueBubbleClick" :style="{
    position: 'absolute',
    left: '45%',
    top: '58%',
    width: '48px',
    height: '48px',
    background: 'white',
    borderRadius: '50%',
    cursor: 'pointer'
  }" v-bind:class="'flex justify-center items-center'">

      <div :class="{
    'absolute top-0 left-0 py-1 pl-14 pr-6 rounded-full bg-cyan-400 opacity-0 transition-all text-white border-2 border-white': true,
    'h-12 opacity-100 duration-300': blueBubbleExpanded,
    'hidden': !blueBubbleExpanded,
  }" v-bind:class="'text-center text-sb-display-semi-bold text-sm flex items-center'">Мотивационная тропа
      </div>

      <div v-bind:class="'flex justify-center items-center bg-cyan-400 w-11 h-11 rounded-full relative'">
        <div v-bind:class="'flex justify-center items-center bg-white w-9 h-9 rounded-full'">
          <div :class="{
    [`bg-cyan-400 w-7 h-7 rounded-full flex justify-center
           items-center text-white text-sb-display-bold`]: true
  }">
          </div>
        </div>
      </div>
    </div>

  </div>
</template>