export default [
  {
    id: 1,
    coords: { x: 44, y: 44 },
    locationName: "Главный корпус 1 этаж",
    mapLocationName: "Главный корпус",
    timestamps: {
      "00:00": "glavkorp/floor1/0.jpg",
      "00:09": "glavkorp/floor1/1.jpg",
      "00:14": "glavkorp/floor1/2.jpg",
      "00:27": "glavkorp/floor1/3.jpg",
      "04:15": "glavkorp/floor1/4.jpg",
      "04:31": "glavkorp/floor1/5.jpg",
      "04:55": "glavkorp/floor1/6.jpg",
      "05:21": "glavkorp/floor1/7.jpg",
      "06:14": "glavkorp/floor1/8.jpg",
      "06:55": "glavkorp/floor1/9.jpg",
      "09:32": "glavkorp/floor1/10.jpg",
      "09:53": "glavkorp/floor1/11.jpg",
      "12:30": "glavkorp/floor1/12.jpg",
      "17:05": "glavkorp/floor1/13.jpg",
    },
    tips: {
      "00:03":
        "Для удобства прослушивания истории предлагаем присесть на диван",
      "05:11": "Вы можете поставить аудиотрек на паузу и взять кофе",
      "05:25": "Направляйтесь к лестнице вместе с нашими героями",
    },
    audio: "https://storage.yandexcloud.net/testingwow/001.%20%D0%9F%D0%B5%D1%80%D0%B2%D1%8B%D0%B9%20%D1%8D%D1%82%D0%B0%D0%B6.mp3",
    facts: [
      "Первый камень в основание СберУниверситета был заложен в 2010 году.",
      "Живое пианино работает с 8:00 до 20:00 и успевает сыграть за это время около 240 композиций. Если вы хотите, вы можете сыграть на пианино сами.",
      "В 2007 году Даши Намдаков выступил художником в фильме Сергея Бодрова «Монгол». За эту работу художник получил престижную кинопремиею «Ника»",
      "На территории кампуса СберУниверситета установлено 17 скульптур Даши Намдакова - целая выставка!",
      "Любимый материал скульптора - бронза, также он создает работы из золота, серебра, драгоценных камней, дерева и кости.",
    ],
    miniMap: "assets/minimap-glavkorp.jpg",
    nearbyLocations: [4, 2, 7],
    icon: "glavkorp/glavkorp.svg",
  },
  {
    id: 2, 
    locationName: "Главный корпус 2 этаж", 
    timestamps: {
      "00:00": "glavkorp/floor2/0.jpg",
      "00:19": "glavkorp/floor2/1.jpg",
      "01:27": "glavkorp/floor2/2.jpg",
    },
    audio: "https://storage.yandexcloud.net/testingwow/002.%20%D0%92%D1%82%D0%BE%D1%80%D0%BE%D0%B9%20%D1%8D%D1%82%D0%B0%D0%B6.mp3",
    facts: [
      "У СберУниверситета есть свой образовательный подкаст, он называется «Займи слот». В нём лидеры разных отраслей делятся со слушателями своим профессиональным опытом.",
      "В систему «Лидеры учат лидеров» вовлечены более 400 руководителей, участвующих в 30–40 программах ежегодно.",
      "Система 'лидеры учат лидеров' применяется в корпоративных университетах таких гигантов, как Boeing, Google, Apple.",
    ],
    miniMap: "assets/minimap-glavkorp.jpg",
    nearbyLocations: [1, 3, 2],
    icon: "glavkorp/glavkorp.svg",
  },
  {
    id: 3, 
    locationName: "Главный корпус 3 этаж", 
    timestamps: {
      "00:00": "glavkorp/floor3/0.jpg",
      "00:12": "glavkorp/floor3/1.jpg",
      "01:01": "glavkorp/floor3/2.jpg",
      "04:42": "glavkorp/floor3/3.jpg",
    },
    audio: "https://storage.yandexcloud.net/testingwow/003.%20%D0%A2%D1%80%D0%B5%D1%82%D0%B8%D0%B9%20%D1%8D%D1%82%D0%B0%D0%B6.mp3",
    facts: [
      "Беспилотные такси, используемые в кампусе СберУниверситета, разработаны российской компанией SberAutoTech. Флот SberAutoTech насчитывает около 200 машин. В соответствии с российским законодательством, в салоне на месте водителя находится инженер-испытатель.",
      "Эрик Ван Эгераат - известный голландский архитектор, он построил около 100 объектов в более чем 10 странах мира.",
      "В России находится 15 архитектурных объектов Эрика Ван Эгераата, большая часть из них расположена в Москве.",
    ],
    miniMap: "assets/minimap-glavkorp.jpg",
    nearbyLocations: [1, 4, 2],
    icon: "glavkorp/glavkorp.svg",
  },
  {
    id: 4,
    coords: { x: 44, y: 54 },
    locationName: "Галерея",
    timestamps: {
      "01:29": "gallery/0.jpg",
      "01:48": "gallery1/1.jpg",
      "02:26": "gallery1/1.jpg",
      "02:58": "gallery/1.jpg",
    },
    tips: {
      "00:01": "Встаньте лицом к парку и направляйтесь в левую часть галереи",
    },
    audio: "https://storage.yandexcloud.net/testingwow/004.%20%D0%93%D0%B0%D0%BB%D0%B5%D1%80%D0%B5%D1%8F.mp3",
    facts: [
      "Ученые доказали, что хождение босиком развивает мозг, улучшает работу лимфатической системы, стабилизирует эмоции.",
      "Первая босоногая тропа появилась в Кисловодске в 2019 году.",
      "На босоногой тропе в СберУниверситете вам встретятся такие виды покрытия, как песок, шишки, щепки, мелкая галька и крупные валуны. мелкая галька и крупные валуны.",
      "Одним из самых известных загородных кампусов в мире является кампус Оксфорда, престижного университета, основанного еще в 12 веке.",
    ],
    miniMap: "assets/minimap-gallery.jpg",
    nearbyLocations: [1, 5, 7],
    icon: "gallery/gallery.svg",
  },
  {
    id: 5,
    coords: { x: 36, y: 80 },
    locationName: "Гостиничные корпуса",
    timestamps: {
      "00:00": "guest/0.jpg",
      "00:55": "guest/1.jpg",
    },
    audio: "https://storage.yandexcloud.net/testingwow/005.%20%D0%93%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B8%D1%87%D0%BD%D1%8B%D0%B5%20%D0%BA%D0%BE%D1%80%D0%BF%D1%83%D1%81%D0%B0.mp3",
    facts: [
      "На ресепшене гостиницы можно заказать одеяло с наполнителем из гречневой шелухи для комфортного и экологичного сна.",
    ],
    miniMap: "assets/minimap-guest.jpg",
    nearbyLocations: [4, 6, 7],
    icon: "guest/guest.svg",
  },
  {
    id: 6,
    coords: { x: 13, y: 71 },
    locationName: "Лабиринт",
    timestamps: {
      "00:00": "maze/0.jpg",
      "03:47": "maze/0.jpg",
    },
    tips: {
      "03:46":
        "Аудиотрек на паузе, чтобы Вы насладились прогулкой в лабиринте. Пройдите по пути, который ведет к центру лабиринта. Наш обещанный сюрприз ждет именно там. Как только будете у цели, нажмите «ОК» и наше приключение продолжится",
    },
    audio: "https://storage.yandexcloud.net/testingwow/006.%20%D0%9B%D0%B0%D0%B1%D0%B8%D1%80%D0%B8%D0%BD%D1%82.mp3",
    facts: [
      "Самое большое в мире скопление неолитических лабиринтов находится на Соловецких островах — 35 лабиринтов, которые на местном диалекте называются «Вавилоны»..",
      " Самый большой лабиринт находится на севере Италии, недалеко от города Пармы, занимает площадь 8 гектар и имеет протяженность 3 километра.",
      "Самым древним лабиринтом в мире является египетский, он был построен в 2300 году до н. э. и находится у озера Биркет-Карун в окрестностях Каира.",
    ],
    miniMap: "assets/minimap-maze.jpg",
    nearbyLocations: [5, 7, 4],
    icon: "maze/maze.svg",
  },
  {
    id: 7,
    coords: { x: 13, y: 65 },
    locationName: "Центральный парк",
    timestamps: {
      "00:00": "park/0.jpg",
      "02:18": "park/1.jpg",
      "03:39": "park/1.jpg",
      "04:25": "park/1.jpg",
    },
    audio: "https://storage.yandexcloud.net/testingwow/007.%20%D0%A6%D0%B5%D0%BD%D1%82%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%BF%D0%B0%D1%80%D0%BA.mp3",
    facts: [
      "Лунный глаз - скульптура, парная к скульптуре Лунные врата. Она символизирует трансформацию, переход из одного состояния в другое. Но кто сможет пройти через эти узкие врата? Только тому, кто пройдет лабиринт знаний, откроется широкий путь...",
      "На территории кампуса СберУниверситета есть и еще одна скульптура Элиссон Армор - «Концентрические круги». Это некая модель пространства, которую можно изменять, вращать в разных направлениях. Идея перекликается с идеей самого Сбер Университета - места, способствующего изменениям.",
      "Эллисон Армор известна своими инновационными подходами к созданию водных объектов, скульптур и садовых инсталляций, в которых использует такие материалы, как акрил и нержавеющая сталь.",
      "Даши Намдаков создает не только скульптуры, но и куклы. Они напоминают персонажей исторических легенд, героев бурятского эпоса или буддийских притч.",
    ],
    miniMap: "assets/minimap-park.jpg",
    nearbyLocations: [6, 8, 1],
    icon: "park/park.svg",
  },
  {
    id: 8,
    coords: { x: 23, y: 41 },
    locationName: "Спортивный комплекс",
    timestamps: {
      "01:14": "sport/0.jpg",
      "01:17": "sport/1.jpg",
      "01:20": "sport/1.jpg",
      "01:23": "sport/1.jpg",
      "01:26": "sport/1.jpg",
    },
    audio: "https://storage.yandexcloud.net/testingwow/008.%20%D0%A1%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B9%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81.mp3",
    facts: ["Длина бассейна составляет 24,5 метра, вместо стандартных 25."],
    miniMap: "assets/minimap-sport.jpg",
    nearbyLocations: [4, 9, 7],
    icon: "sport/sport.svg",
  },
  {
    id: 9, 
    coords: { x: 54, y: 34 },
    locationName: "Корпоративный центр 1 этаж",
    mapLocationName: "Корпоративный центр",
    timestamps: {
      "00:15": "korpcenter/floor1/0.jpg",
      "01:05": "korpcenter/floor1/1.jpg",
      "01:55": "korpcenter/floor1/1.jpg",
    },
    audio: "https://storage.yandexcloud.net/testingwow/009.%20%D0%9A%D0%BE%D1%80%D0%BF%D0%BE%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B9%20%D1%86%D0%B5%D0%BD%D1%82%D1%80.%20%D0%9F%D0%B5%D1%80%D0%B2%D1%8B%D0%B9%20%D1%8D%D1%82%D0%B0%D0%B6.mp3",
    facts: [
      "Mriya Resort & SPA — ведущий мировой курорт премиум-класса, расположенный на Южном берегу Крыма между живописным горным массивом и бескрайним морским простором",
    ],
    miniMap: "assets/minimap-korpcentr.jpg",
    nearbyLocations: [11, 10, 8],
    icon: "korpcenter/korpcenter.svg",
  },
  {
    id: 10, 
    locationName: "Корпоративный центр 2 этаж", 
    timestamps: {
      "00:15": "korpcenter/floor2/0.jpg",
      "00:54": "korpcenter/floor2/1.jpg",
      "00:59": "korpcenter/floor2/2.jpg",
    },
    audio: "https://storage.yandexcloud.net/testingwow/010.%20%D0%9A%D0%BE%D1%80%D0%BF%D0%BE%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B9%20%D1%86%D0%B5%D0%BD%D1%82%D1%80.%20%D0%92%D1%82%D0%BE%D1%80%D0%BE%D0%B9%20%D1%8D%D1%82%D0%B0%D0%B6.mp3",
    facts: [
      "В образовательной системе СберУниверситета задействованы более 340 преподавателей и спикеров.",
    ],
    miniMap: "assets/minimap-korpcentr.jpg",
    nearbyLocations: [8, 11, 9],
    icon: "korpcenter/korpcenter.svg",
  },
  {
    id: 11,
    coords: { x: 34, y: 24 },
    locationName: "Японский сад",
    timestamps: {
      "00:00": "japan/0.jpg",
      "00:16": "japan/1.jpg",
      "01:21": "japan/2.jpg",
      "01:27": "japan/3.jpg",
    },
    audio: "https://storage.yandexcloud.net/testingwow/011.%20%D0%AF%D0%BF%D0%BE%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B4.mp3",
    facts: [
      "Хокку описывают природу и обычно пишутся в настоящем времени. ",
      "Стихотворения Хокку пишутся без рифмы, поэтому они больше похожи на цитаты, чем на поэзию.",
      "Алтайская баня выстроена из кедровых бревен и оборудована настоящей русской печью.",
      "Посетителям бани предлагается на выбор более 40 банных процедур.",
      "На территории кампуса расположено 15 коттеджей, с двумя или тремя спальнями каждый.",
      "Пространство в коттеджах расположено 'изнутри наружу' - стеклянные стены создают ощущение единения с природой, а для создания приватности можно задернуть шторы.",
      "В каждом коттедже есть отдельная комната-кабинет для обучения и работы.",
    ],
    miniMap: "assets/minimap-japan.jpg",
    nearbyLocations: [9, 1, 8],
    icon: "japan/japan.svg",
  },
];
