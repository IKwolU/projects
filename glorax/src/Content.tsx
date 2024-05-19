import { useState } from "react";
import CustomAudioPlayer from "@/components/ui/Custom-player";
import CustomSheet from "@/components/ui/Custom-sheet";
import content from "./assets/content.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faCircleQuestion,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../public/img/logoGlorax.png";
import choice1 from "../public/img//choice-img-1.png";
import choice2 from "../public/img//choice-img-2.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRecoilState } from "recoil";
import { contentIdAtom, currentTimeAtom } from "./atoms";

function Content() {
  const [contentId] = useRecoilState(contentIdAtom);
  const [isContentShow, setIsContentShow] = useState(true);
  const [, setAudioTime] = useState(0);
  const [currentTime] = useRecoilState(currentTimeAtom);
  const [questionsClicked, setQuestionsClicked] = useState(false);
  const [questionId, setQuestionId] = useState<number>(-1);
  const [timeToChoose] = useState(false);
  const [menuOpen, menuOpenSet] = useState(false);

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
  };

  return (
    <>
      <div
        onClick={() => menuOpenSet(!menuOpen)}
        className="cursor-pointer fixed bottom-12 z-[53] flex w-full px-1 sm:px-2 bg-opacity-40 justify-center items-center"
      >
        <img src="./img/menu.png" alt="" className="object-contain w-32" />
      </div>
      {menuOpen && (
        <div className="text-xl fixed bottom-24 cursor-pointer flex w-full justify-center items-center">
          <div className="bg-white rounded p-4 shadow border border-t-2 border-b-0 border-gray-500/10"> 
            {[
              "Дом 1",
              "Дом 2",
              "Дом 3",
              "Дом 4",
              "Дом 5",
              "Дом 6",
              "Иммерсивная прогулка",
              "Справка",
            ].map((x) => (
              <div className="mb-2 p-0.5 px-2 text-gray-800 hover:bg-blue rounded hover:text-white">
                {x}
              </div>
            ))}
          </div>
        </div>
      )}
      {questionsClicked && (
        <div
          onClick={(e) =>
            e.target === e.currentTarget ? setQuestionsClicked(false) : null
          }
          className="fixed z-[53] flex w-full flex-col h-full left-0 px-1 sm:px-2 bottom-0 bg-black bg-opacity-40 justify-center items-center"
        >
          <div className="z-20 flex justify-end w-[280px] sm:w-[350px] h-4 pr-2 -mb-6 right-2">
            <FontAwesomeIcon
              icon={faXmark}
              className="text-zinc-800"
              onClick={() => setQuestionsClicked(false)}
            />
          </div>
          <div className="bottom-0 z-10 h-4 -mb-4 w-[280px] sm:w-[350px] from-transparent bg-gradient-to-t to-white rounded-t-3xl"></div>
          <div className=" relative pb-4 px-4 py-2 space-y-2 overflow-y-auto bg-white max-h-[70%] w-[280px] sm:w-[350px] rounded-2xl opacity-95 text-zinc-700 scrollbar-thin scrollbar-thumb-blue scrollbar-track-lightblue scrollbar-thumb-rounded-full scrollbar-hide">
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
                <p onClick={() => setQuestionId(i)}>
                  {i + 1}) {question}
                </p>
                {questionId === i && <p className="pl-2 text-sm">{answer}</p>}
              </div>
            ))}
          </div>
          <div className="bottom-0 z-10 h-4 -mt-4 w-[280px] sm:w-[350px] from-white bg-gradient-to-t to-transparent rounded-b-2xl"></div>
        </div>
      )}
      {/* <div className="fixed z-[51] flex w-full left-4 bottom-6 md:bottom-1 ">
        <FontAwesomeIcon
          onClick={() => setQuestionsClicked(!questionsClicked)}
          icon={faCircleQuestion}
          className="w-8 h-8 transition-opacity opacity-50 cursor-pointer text-blue hover:opacity-100 active:opacity-100"
        />
      </div> */}
      {/* <div className="fixed left-0 z-50 flex w-full h-8 bottom-6 md:bottom-0">
        <img src="img/360.svg" className="mx-auto h-7 w-28 text-blue" alt="" />
      </div> */}
      <div className="fixed bottom-1 z-50 flex w-full justify-center text-sm text-zinc-500 my-2">
        <p>© 2024. GloraX. Все права защищены</p>
      </div>
      {/* <div className="fixed bottom-0 left-0 z-50 flex w-[80vw] h-10 bg-blue bg-opacity-30"></div>
      <div className="fixed top-0 left-0 z-50 flex w-[80vw] h-10 bg-blue bg-opacity-30"></div>
      <div className="fixed top-0 right-0 z-50 flex w-10 h-[80vh] bg-blue bg-opacity-30"></div>
      <div className="fixed top-0 left-0 z-50 flex w-10 h-[80vh] bg-blue bg-opacity-30"></div> */}
      {content.map((x, i: number) => (
        <CustomSheet
          key={`sheet${i}`}
          isOpen={contentId === i ? true : false}
          content={
            <div
              className={`fixed flex flex-row-reverse top-0 right-0 z-50 h-full sm:w-[380px] w-[340px] transform transition-all ease-in-out bg-white  ${
                contentId === i
                  ? `${
                      isContentShow
                        ? "translate-x-0"
                        : "translate-x-[300px] sm:translate-x-[340px]"
                    } translate-x-0`
                  : "translate-x-full"
              }`}
            >
              <div className="p-4 overflow-y-auto">
                <div className="flex items-center justify-between h-12 -ml-2">
                  <img
                    src={logo}
                    alt=""
                    className="object-contain h-10 pl-2 "
                  />
                  <p className="m-0 -mt-2 text-black">{x.title}</p>
                </div>
                <div className="px-2 mb-4 text-base font-semibold text-black whitespace-pre-line">
                  {x.description_title}
                </div>
                <div className="px-2 mb-4 text-base text-black whitespace-pre-line">
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

                <div className="text-xl font-bold text-black">
                  {/* Знаете ли вы что: */}
                </div>
                <div className="">
                  <Slider {...settings}>
                    {x.facts.map((fact) => (
                      <div
                        className="flex flex-col items-center justify-center w-full p-3 pt-6 space-y-2 bg-lightblue rounded-3xl h-[420px]"
                        key={`choice_${i}`}
                      >
                        {fact.image && (
                          <img
                            src={fact.image}
                            className="object-cover object-center w-64 h-64 mx-auto rounded-2xl"
                            alt=""
                          />
                        )}
                        {fact.type === "text" && (
                          <h4 className="h-4 px-0 pb-3 text-sm font-semibold text-black sm:px-4">
                            {fact.title}
                          </h4>
                        )}
                        {fact.type === "text" && (
                          <p
                            className={`${
                              fact.image ? "h-24" : "h-[356px]"
                            } px-0 pb-3 overflow-y-auto text-sm text-black sm:px-4 scrollbar-thin scrollbar-thumb-blue scrollbar-track-lightblue scrollbar-thumb-rounded-full scrollbar-hide`}
                          >
                            {fact.text}
                          </p>
                        )}
                        {fact.type === "link" && (
                          <a
                            target="_blank"
                            href={fact.text}
                            className="block w-full h-24 px-0 pt-6 text-sm text-black sm:px-4 "
                          >
                            {fact.title}
                          </a>
                        )}
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
              <div
                onClick={() => setIsContentShow(!isContentShow)}
                className="flex items-center justify-center h-full px-2 text-black rounded-lg cursor-pointer bg-lightblue"
              >
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className={`h-7 transition-transform text-blue ${
                    isContentShow ? "" : "rotate-180"
                  }`}
                />
              </div>
            </div>
          }
        />
      ))}
    </>
  );
}

export default Content;
