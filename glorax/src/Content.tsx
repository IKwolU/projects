import { useState } from "react";
import CustomAudioPlayer from "@/components/ui/Custom-player";
import CustomSheet from "@/components/ui/Custom-sheet";
import content from "./assets/content.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
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

  const [timeToChoose] = useState(false);

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
      <div className="fixed bottom-0 left-0 z-50 flex w-full h-40">
        <img src="img/360.svg" className="mx-auto w-80 h-60 text-blue" alt="" />
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
                <div className="flex items-center h-12 -ml-2">
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
                        <img
                          src={fact.image}
                          className="object-cover object-center w-64 h-64 mx-auto rounded-2xl"
                          alt=""
                        />
                        {fact.type === "text" && (
                          <h4 className="h-4 px-0 pb-3 text-sm font-semibold text-black sm:px-4">
                            {fact.title}
                          </h4>
                        )}
                        {fact.type === "text" && (
                          <p className="h-24 px-0 pb-3 overflow-y-auto text-sm text-black sm:px-4 scrollbar-thin scrollbar-thumb-blue scrollbar-track-lightblue scrollbar-thumb-rounded-full scrollbar-hide">
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
