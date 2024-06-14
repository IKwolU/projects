import { useEffect, useState } from "react";
import CustomAudioPlayer from "@/components/ui/Custom-player";
import CustomSheet from "@/components/ui/Custom-sheet";
import content from "./assets/content.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faClock,
  faMagnifyingGlassPlus,
  faPersonWalking,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../public/img/logoGlorax.png";
import choice1 from "../public/img//choice-img-1.png";
import choice2 from "../public/img//choice-img-2.png";
import closeIcon from "../public/img/close_icon.svg";
import iconButton from "../public/img/Icon_Button.svg";
import halpFace from "../public/img/face.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRecoilState } from "recoil";
import { contentIdAtom, currentTimeAtom, navigationTimeAtom } from "./atoms";

function Content() {
  const [contentId] = useRecoilState(contentIdAtom);
  const [isContentShow, setIsContentShow] = useState(true);
  const [, setAudioTime] = useState(0);
  const [currentTime] = useRecoilState(currentTimeAtom);
  const [, setCurrentNav] = useRecoilState(navigationTimeAtom);
  const [questionsClicked, setQuestionsClicked] = useState(false);
  const [questionId, setQuestionId] = useState<number>(-1);
  const [timeToChoose] = useState(false);
  const [menuOpen, menuOpenSet] = useState(false);
  const [isHelpShowed, setIsHelpShowed] = useState(false);
  const [isMapClicked, setIsMapClicked] = useState(false);
  const [bigTextOpened, setBigTextOpened] = useState(false);
  const [isSideAutoClosed, setIsSideAutoClosed] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [storisId, setStorisId] = useState(1);

  const handleAudioTimeUpdate = () => {
    setAudioTime(currentTime);
  };

  // useEffect(() => {
  //   if (currentTime === content[0].choice__time) {
  //     setTimeToChoose(true);
  //   }
  // }, [audioTime]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    beforeChange: (current: number, next: number) => {
      setBigTextOpened(false);
      setActiveSlide(next);
      current && null;
    },
  };

  useEffect(() => {
    if (!isSideAutoClosed && currentTime > content[0].help_time) {
      setIsHelpShowed(true);
      setIsContentShow(false);
      setIsSideAutoClosed(true);
    }
  }, [currentTime]);

  const handleQuestionOpen = () => {
    setQuestionId(-1);
    setQuestionsClicked(!questionsClicked);
  };

  const helpers = content[0].helpers;

  const handleClosedHelper = (i: number) => {
    helpers[i].closed = true;
  };

  // const currentNavigationData = content[0].nav_variants.find(
  //   (x) => x.id === currentNav
  // );

  const handleClickQuestion = (number: number) => {
    if (number === 1) {
      setStorisId(number);
    } else {
      setQuestionId(number);
    }
  };

  const handleStorisClose = () => {
    setStorisId(1);
    setQuestionId(-1);
    setQuestionsClicked(!questionsClicked);
  };

  useEffect(() => {
    if (storisId > 0 && storisId < 2) {
      setTimeout(() => {
        questionId === 0 && setStorisId(storisId + 1);
      }, 15000);
      setQuestionsClicked(false);
    }
  }, [storisId]);

  return (
    <>
      {helpers.map((x, i) => (
        <>
          {!x.closed && x.time < currentTime && (
            <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full text-brown ">
              <div className="   max-w-[350px] h-auto flex flex-col  border border-brown rounded-[25px] ">
                <div
                  className="flex items-center justify-center pt-8 pb-12 -mb-6 bg-top bg-no-repeat bg-contain rounded-t-3xl bg-lightbrown"
                  style={{ backgroundImage: "url(../public/img/bg-face.svg)" }}
                >
                  <img src={halpFace} alt="" className="w-40" />
                </div>
                <div className="flex flex-col items-center w-full p-4 py-2 pb-2 mx-auto space-y-2 text-black bg-white border border-white outline-none rounded-3xl">
                  <h3 className="text-[24px] ">{x.title}</h3>
                  <p className="py-2 text-[20px] text-center">{x.text}</p>
                  <div className="py-5">
                    <div className="flex justify-start p-2 rounded-full bg-blue w-fit ">
                      <img
                        onClick={() => handleClosedHelper(i)}
                        src={iconButton}
                        alt=""
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ))}
      {isHelpShowed && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full text-brown">
          <div className="p-4 space-y-1 bg-lightpink rounded-xl w-[300px] h-auto flex flex-col shadow-sm border-brown border">
            {/* <div className="flex flex-col items-center mx-auto space-y-2 w-fit">
              <p>Давайте начнем двигаться:</p>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faClock}
                  className={`h-4 transition-transform  `}
                />{" "}
                <p> 7мин</p>
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faPersonWalking}
                  className={`h-4 transition-transform  `}
                />{" "}
                <p> 650м</p>
              </div>
            </div>
            <div className="h-[1px] w-[80%] bg-white rounded mx-auto"></div>
            <div className="py-2"></div>
            <img
              src="./img/helpimage.png"
              alt=""
              className="object-contain w-full h-40"
            />*/}
            <div className="font-bold text-center">Ваш вариант истории:</div>
            <div className="flex items-center justify-center py-4 my-4 space-x-9">
              {content[0].nav_variants
                .filter((y) => y.selection_icon)
                .map((y) => (
                  <div className="" key={y.id}>
                    <img
                      src={y.selection_icon!}
                      alt=""
                      className="w-20 h-auto transition-transform cursor-pointer hover:scale-110"
                      onClick={() => setCurrentNav(y.id)}
                    />
                  </div>
                ))}
            </div>

            <div className="flex justify-start w-full ">
              <img
                src="/img/glorax_halp_arrow.svg"
                alt=""
                className="cursor-pointer"
                onClick={() => setIsHelpShowed(false)}
              />
            </div>
          </div>
        </div>
      )}
      <div
        onClick={() => menuOpenSet(!menuOpen)}
        className="fixed top-2 left-2 z-[50] flex w-16 px-1 sm:px-2 bg-opacity-40 justify-center items-center"
      >
        {/* <img
          src="./img/menu.png"
          alt=""
          className="object-contain w-20 cursor-pointer "
        /> */}
        <button className="w-20 px-3 py-1 m-1 text-[10px] text-white uppercase rounded-full bg-blue border-none focus:outline-none">
          Меню
        </button>
      </div>
      {menuOpen && (
        <div
          className="fixed top-0 bottom-0 left-0 flex items-start justify-start w-full mt-10 ml-2 text-sm text-brown"
          onClick={(e) =>
            e.target === e.currentTarget && menuOpenSet(!menuOpen)
          }
        >
          <div className="p-4 pb-2 rounded-[5px] bg-lightpink uppercase">
            {[
              "Дом Башкирова",
              "Дом Бугрова",
              "Дом Дягтерёва",
              "Дом Балакирева",
              "Дом Килевейна",
              "Благовещенские башни",
              "Иммерсивный маршрут",
              "Инструкции",
            ].map((x) => (
              <div key={x}>
                <div
                  className="mb-2  p-0.5 px-2  hover:text-blue  hover:opacity-70  border-none rounded-[5px]  cursor-pointer transition-colors "
                  onClick={() => x === "Инструкции" && handleQuestionOpen()}
                >
                  {x}
                </div>
                <div
                  className={`${x !== "Инструкции" && "h-px bg-brown my-2"}`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {questionsClicked && (
        <div
          onClick={(e) =>
            e.target === e.currentTarget ? handleQuestionOpen() : null
          }
          className="fixed z-[53] flex w-full flex-col h-full left-0 px-1 sm:px-2 bottom-0 bg-black bg-opacity-40 justify-center items-center text-white text-sm"
        >
          <div className="z-20 flex justify-end w-[280px] sm:w-[350px] h-4 pr-2 -mb-6 right-2 cursor-pointer">
            <FontAwesomeIcon
              icon={faXmark}
              className="text-brown"
              onClick={() => handleQuestionOpen()}
            />
          </div>
          <div className="bottom-0 z-10 h-4 -mb-4 w-[280px] sm:w-[350px] from-transparent bg-gradient-to-t to-lightpink rounded-t-3xl"></div>
          <div className=" relative pb-4 px-6 py-4 space-y-2 overflow-y-auto bg-lightpink max-h-[70%] w-[280px] sm:w-[350px] rounded-[5px] opacity-95 scrollbar-thin scrollbar-thumb-brown scrollbar-track-lightbrown scrollbar-thumb-rounded-full scrollbar-hide">
            {[
              {
                question: "С чего начать (путешествие/приключение/изучение)?",
                answer: "1234",
              },
              {
                question: "Как вернуться назад?",
                answer: "1234",
              },
              {
                question: "Можно ли изменить маршрут?",
                answer: "1234",
              },
              {
                question: "Сколько по времени займет маршрут/аудио?",
                answer: "1234",
              },
              {
                question: "Можно ли пройти путь заново?",
                answer: "1234",
              },
              {
                question:
                  "Есть ли ограничения по времени для прохождения маршрута?",
                answer: "1234",
              },
              {
                question: "Что такое иммерсивный маршрут?",
                answer: "1234",
              },
              {
                question: "Могу ли вернуться к маршруту позже?",
                answer: "1234",
              },
              {
                question:
                  "Как я могу обратиться за технической поддержкой или сообщить об ошибке?",
                answer: "1234",
              },
              {
                question:
                  "Какие дополнительные функции и возможности доступны на маршрутах?",
                answer: "1234",
              },
            ].map(({ question, answer }, i) => (
              <div className="">
                <p
                  onClick={() => handleClickQuestion(i)}
                  className="p-1 uppercase transition-colors rounded cursor-pointer hover:text-blue text-brown "
                >
                  {question}
                </p>
                {questionId === i && (
                  <p className="pl-2 text-sm text-brown">{answer}</p>
                )}
                <div className={`${i !== 9 && "h-px bg-brown my-2"}`}></div>
              </div>
            ))}
          </div>
          <div className="bottom-0 z-10 h-4 -mt-4 w-[280px] sm:w-[350px] from-lightpink bg-gradient-to-t to-transparent rounded-b-2xl"></div>
        </div>
      )}
      {questionId === 0 && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[55] bg-lightpink bg-opacity-25 space-x-2 flex justify-center items-center sm:rounded-lg">
          <div className="flex relative items-center justify-center space-x-0 bg-opacity-25  bg-lightpink w-full h-full sm:max-w-96 sm:rounded-lg  sm:max-h-[700px] overflow-hidden ">
            <div
              onClick={() => setStorisId(storisId + 1)}
              className={`absolute flex flex-col justify-between top-0 pt-14 pb-8 left-0 w-full h-full px-6  bg-brown text-lightpink sm:max-w-96 transition-transform sm:rounded sm:max-h-[700px] ${
                storisId === 1
                  ? "translate-x-0"
                  : storisId == 2
                  ? "-translate-x-full"
                  : "translate-x-full"
              }`}
            >
              <div className="">
                <h3 className="mb-6 font-semibold">
                  С чего начать путешествие?
                </h3>
                <div className="space-y-20">
                  <p>
                    Вы находитесь в стартовой точке иммерсивного маршрута. Это
                    означает, что вы будете воспринимать информацию и историю
                    особым образом — буквально погружаясь в неё с помощью
                    аудиосопровождения.
                  </p>
                  <p>
                    Вас ждет атмосфера невыдуманных историй. А от вашего выбора
                    и действий зависит, как будет развиваться история и каким
                    окажется финал.
                  </p>
                </div>
              </div>
              <button
                className="flex items-center justify-start gap-4 p-2 pr-6 text-sm uppercase border-none rounded-full w-fit bg-blue"
                onClick={() => setStorisId(storisId + 1)}
              >
                <img src={iconButton} alt="" className="w-10" />
                Как работает платформа
              </button>
            </div>

            <div
              style={{
                backgroundImage: "url(../public/img/storysBG.svg)",
                backgroundSize: "100px",
              }}
              className={`absolute flex justify-between flex-col top-0 left-0 pb-8 bg-no-repeat bg-right-bottom  w-full h-full px-6 py-12 bg-brown text-lightpink sm:max-w-96 sm:rounded transition-transform sm:max-h-[700px] ${
                storisId === 2 ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-6 h-full">
                <FontAwesomeIcon
                  onClick={() => setStorisId(storisId - 1)}
                  icon={faAnglesRight}
                  className={`   rotate-180 h-4 text-lightpink`}
                />
              </div>
              <img
                src={closeIcon}
                alt=""
                onClick={() => handleStorisClose()}
                className="absolute w-10 cursor-pointer right-2 top-2"
              />

              <div className="">
                <h3 className="mb-6 font-semibold">
                  Как работает платформа и зачем она нужна?
                </h3>
                <div className="space-y-6">
                  <p>
                    Платформа представляет собой интерактивный аудиогид, который
                    помогает пользователям погружаться в историю местности через
                    аудиовизуальные элементы и иммерсивные маршруты. Она
                    необходима для уникального знакомства с историей и
                    культурой, позволяя самостоятельно исследовать интересные
                    места и узнавать о событиях прошлого.
                  </p>
                  <p>
                    Глоракс (GloraX) — компания, создающая и развивающая проекты
                    в сфере недвижимости.
                  </p>
                </div>
              </div>
              <button
                className="flex items-center justify-start gap-4 p-2 pr-6 text-sm uppercase border-none rounded-full w-fit bg-blue"
                onClick={() => handleStorisClose()}
              >
                <img src={iconButton} alt="" className="w-10" />
                Начать путешествие
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <div className="fixed z-[51] flex w-full left-4 bottom-6 md:bottom-1 ">
        <FontAwesomeIcon
          onClick={() => handleQuestionOpen()}
          icon={faCircleQuestion}
          className="w-8 h-8 transition-opacity opacity-50 cursor-pointer text-brown hover:opacity-100 active:opacity-100"
        />
      </div> */}
      {/* <div className="fixed left-0 z-50 flex w-full h-8 bottom-6 md:bottom-0">
        <img src="img/360.svg" className="mx-auto h-7 w-28 text-brown" alt="" />
      </div> */}
      <div className="fixed z-50 flex justify-center w-full my-2 text-sm bottom-1 text-zinc-500">
        <p>© 2024. GloraX. Все права защищены</p>
      </div>
      {/* <div className="fixed bottom-0 left-0 z-50 flex w-[80vw] h-10 bg-brown bg-opacity-30"></div>
      <div className="fixed top-0 left-0 z-50 flex w-[80vw] h-10 bg-brown bg-opacity-30"></div>
      <div className="fixed top-0 right-0 z-50 flex w-10 h-[80vh] bg-brown bg-opacity-30"></div>
      <div className="fixed top-0 left-0 z-50 flex w-10 h-[80vh] bg-brown bg-opacity-30"></div> */}
      {content.map((x, i: number) => (
        <CustomSheet
          key={`sheet${i}`}
          isOpen={contentId === i ? true : false}
          content={
            <div
              className={`fixed flex flex-row-reverse top-0 right-0 z-50 h-full sm:w-[380px] w-[340px] transform transition-all ease-in-out bg-pink text-UBlack ${
                contentId === i
                  ? `${
                      isContentShow
                        ? "translate-x-0"
                        : "translate-x-[300px] sm:translate-x-[340px]"
                    } translate-x-0`
                  : "translate-x-full"
              }`}
            >
              <div className="overflow-y-auto">
                <div className="flex items-center justify-between h-12 mt-2 ml-4">
                  <p className="m-0 -mt-2 uppercase text-brown">{x.title}</p>
                  <img
                    src={logo}
                    alt=""
                    className="object-contain h-10 pl-4 "
                  />
                </div>
                <div className="px-4 mb-4 text-base font-semibold whitespace-pre-line text-brown">
                  {x.description_title}
                </div>
                <div className="px-4 mb-4 text-base whitespace-pre-line">
                  {x.description}
                </div>
                <div className="relative w-full mb-4 rounded-3xl">
                  <CustomAudioPlayer
                    onPlay={() => handleAudioTimeUpdate}
                    active={contentId === i ? true : false}
                    src={x.source}
                  />
                  {timeToChoose && (
                    <div
                      className="absolute top-0 w-full h-full bg-black bg-no-repeat bg-cover bg-opacity-90 ring-0 rounded-3xl"
                      // style={{ backgroundImage: `url(${bg})` }}
                    >
                      <div className="flex items-center justify-between h-full p-4 space-x-3">
                        <div className="flex flex-col items-center justify-center h-full space-y-2">
                          <p
                            className="text-sm "
                            style={{ color: `${x.choice[0].color}` }}
                          >
                            {x.choice[0].text}
                          </p>
                          <img
                            src={choice1}
                            className="object-contain w-auto h-12"
                            alt=""
                          />
                        </div>
                        <div
                          className="flex flex-col items-center justify-center h-full space-y-2"
                          key={`choice_${i}`}
                        >
                          <p
                            className="text-sm"
                            style={{ color: `${x.choice[1].color}` }}
                          >
                            {x.choice[1].text}
                          </p>
                          <img
                            src={choice2}
                            className="object-contain w-auto h-12"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xl font-bold ">
                  {/* Знаете ли вы что: */}
                </div>
                <div className="relative">
                  <Slider {...settings}>
                    {x.facts.map((fact, n) => (
                      <div
                        className={`flex relative flex-col pb-2 items-center justify-center w-full 
                        } pt-6 space-y-2 overflow-y-hidden  scrollbar-thin scrollbar-thumb-brown scrollbar-track-lightbrown scrollbar-thumb-rounded-full scrollbar-hide `}
                        key={`choice_${i}`}
                      >
                        {fact.image && (
                          <img
                            src={fact.image}
                            className="object-cover object-center w-full mx-auto h-96 "
                            alt=""
                          />
                        )}
                        <div
                          className={`px-4 ${
                            bigTextOpened && activeSlide === n
                              ? "h-full"
                              : "max-h-[60px]"
                          }`}
                        >
                          {fact.type === "text" && (
                            <h4 className="h-4 px-0 pb-3 mt-8 mb-4 text-sm font-semibold sm:px-4 text-brown">
                              {fact.title}
                            </h4>
                          )}
                          {fact.type === "text" && (
                            <p
                              className={`${
                                fact.image ? "" : ""
                              } px-0 pb-0  text-sm sm:px-4 scrollbar-thin scrollbar-thumb-brown scrollbar-track-lightbrown scrollbar-thumb-rounded-full scrollbar-hide`}
                            >
                              {fact.text}
                            </p>
                          )}
                          {fact.type === "link" && (
                            <a
                              target="_blank"
                              href={fact.text}
                              className="block w-full h-24 px-2 pt-6 text-sm sm:px-4 "
                            >
                              {fact.title}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </Slider>

                  <div className="relative flex flex-col w-full h-auto p-4 mt-10 space-y-1 rounded bg-pink">
                    <div className="flex flex-col items-center gap-2 mx-auto w-fit">
                      <p>Продолжительность маршрута:</p>
                      <div className="flex justify-between mb-2 space-x-6">
                        <div className="flex items-center space-x-2">
                          <FontAwesomeIcon
                            icon={faClock}
                            className={`h-4 transition-transform  text-brown`}
                          />{" "}
                          <p> 7мин</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FontAwesomeIcon
                            icon={faPersonWalking}
                            className={`h-4 transition-transform  text-brown`}
                          />{" "}
                          <p> 650м</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-[1px] w-[80%] bg-white rounded mx-auto"></div>
                    <div className="py-2"></div>
                    <img
                      onClick={() => setIsMapClicked(!isMapClicked)}
                      src="./img/helpimage.png"
                      alt=""
                      className="object-contain w-full h-40"
                    />
                    <div className="absolute right-5 bottom-[140px] sm:bottom-[145px]">
                      <FontAwesomeIcon
                        icon={faMagnifyingGlassPlus}
                        className="z-10 h-5 text-brown"
                      />
                    </div>
                  </div>
                  {/* <div className="absolute left-0 w-full h-8 -mb-4 bottom-5 from-transparent bg-gradient-to-b to-brown "></div> */}
                  <FontAwesomeIcon
                    onClick={() => setBigTextOpened(!bigTextOpened)}
                    icon={faAnglesRight}
                    className={`h-7 transition-transform text-white absolute sm:bottom-[275px] bottom-[275px] py-2 left-[46%] ${
                      bigTextOpened ? "-rotate-90" : "rotate-90"
                    }`}
                  />
                </div>
              </div>
              <div
                onClick={() => setIsContentShow(!isContentShow)}
                className="flex items-center justify-center h-full px-2 text-black rounded-lg cursor-pointer bg-lightbrown"
              >
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className={`h-7 transition-transform text-brown ${
                    isContentShow ? "" : "rotate-180"
                  }`}
                />
              </div>
            </div>
          }
        />
      ))}
      {isMapClicked && (
        <div
          className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
          onClick={() => setIsMapClicked(!isMapClicked)}
        >
          <img
            src="./img/helpimage.png"
            alt=""
            className="object-contain w-full h-auto"
          />

          <div className="z-20 top-0 relative flex justify-end w-[280px] h-[210px] sm:w-[350px]  pr-2 -mb-6 right-2 cursor-pointer">
            <FontAwesomeIcon icon={faXmark} className="absolute text-brown" />
          </div>
        </div>
      )}
    </>
  );
}

export default Content;
