import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateForward,
  faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import { currentTimeAtom, titleContentAtom } from "../../../src/atoms";
type CustomAudioPlayerProps = {
  src: string;
  active: boolean;
};

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [, setCurrentTime] = useRecoilState(currentTimeAtom);
  // const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [nextClicked, setNextClicked] = useState<boolean>(false);
  const [backClicked, setBackClicked] = useState<boolean>(false);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [titleContent] = useRecoilState(titleContentAtom);
  const [oldTitle, setOldTitle] = useState(titleContent);
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleTimeUpdate = () => {
        if (!isSeeking) {
          setCurrentTime(audio.currentTime);
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      audio?.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        audio?.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [isSeeking]);

  useEffect(() => {
    if (titleContent !== oldTitle && audioRef.current) {
      setAudioLoaded(false);
      setOldTitle(titleContent);
    }
  }, [titleContent]);

  useEffect(() => {
    if (audioLoaded && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setProgress(0);
      setIsPlaying(false);
    }
  }, [audioLoaded]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleBackClick = () => {
    setBackClicked(true);
    if (audioRef.current) {
      audioRef.current.currentTime > 30
        ? (audioRef.current.currentTime -= 30)
        : (audioRef.current.currentTime = 0);
    }
    setTimeout(() => {
      setBackClicked(false);
    }, 1000);
  };
  const handleNextClick = () => {
    setNextClicked(true);
    if (audioRef.current) {
      audioRef.current.currentTime < audioRef.current.duration - 30
        ? (audioRef.current.currentTime += 30)
        : (audioRef.current.currentTime = audioRef.current.duration);
    }
    setTimeout(() => {
      setNextClicked(false);
    }, 1000);
  };

  const handleAudioLoaded = () => {
    setAudioLoaded(true);
  };

  const handleSeekEnd = (e: any) => {
    if (audioRef.current) {
      const seekTime =
        (parseInt(e.currentTarget.value) / 100) * audioRef.current!.duration;
      audioRef.current.currentTime = seekTime;
      // setCurrentTime(seekTime);
      setProgress(parseInt(e.currentTarget.value));
      setIsSeeking(false);
    }
  };

  const handleSeek = (value: string) => {
    if (isSeeking) {
      const seekTime = (parseInt(value) / 100) * audioRef.current!.duration;
      setCurrentTime(seekTime);
      setProgress(parseInt(value));
    }
  };

  return (
    <div className="custom-audio-player">
      <div className="hidden">
        <audio
          key={src}
          ref={audioRef}
          src={src}
          controls
          onLoadedData={handleAudioLoaded}
          className="hidden w-full h-auto appearance-none"
        ></audio>
      </div>

      <div className="px-4 pt-4 pb-3 rounded-3xl">
        <div className="flex">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onMouseDown={handleSeekStart}
            onTouchStart={handleSeekStart}
            onMouseUp={handleSeekEnd}
            onTouchEnd={handleSeekEnd}
            onChange={(e) => handleSeek(e.target.value)}
            className=" h-[2px] rounded appearance-none bg-brown w-[90%] mx-auto mb-2"
          />
        </div>
        <div className="flex items-center h-[15px] justify-between w-full text-[10px]">
          {audioLoaded && (
            <>
              <span className="">
                {audioRef.current
                  ? `${String(
                      Math.floor(audioRef.current.currentTime / 60)
                    ).padStart(2, "0")}:${String(
                      Math.floor(audioRef.current.currentTime % 60)
                    ).padStart(2, "0")}`
                  : "00:00"}
              </span>
              <span className="">
                {audioRef.current
                  ? `${String(
                      Math.floor(audioRef.current.duration / 60)
                    ).padStart(2, "0")}:${String(
                      Math.floor(audioRef.current.duration % 60)
                    ).padStart(2, "0")}`
                  : "00:00"}
              </span>
            </>
          )}
        </div>
        <div className="flex justify-between w-[50%] -mt-2 mx-auto items-center">
          <div className="relative ">
            <button
              onClick={handleBackClick}
              className="h-4 m-0 border-none focus:outline-none hover:border-none hover:outline-none focus:border-none"
            >
              <FontAwesomeIcon
                icon={faArrowRotateLeft}
                className="h-5 text-brown rotate-180 border-none scale-[-1,1] focus:outline-none hover:border-none hover:outline-none focus:border-none "
              />
            </button>
            {backClicked && (
              <div className="absolute top-[2px] text-[10px] -left-6">-30</div>
            )}
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative m-0 border-none focus:outline-none hover:border-none hover:outline-none focus:border-none"
          >
            {isPlaying ? (
              // <FontAwesomeIcon
              //   icon={faCirclePause}
              //   className="h-10 border-none text-brown focus:outline-none hover:border-none hover:outline-none focus:border-none "
              // />
              <img
                src="/img/pause.png"
                className="h-10 border-none text-blue focus:outline-none hover:border-none hover:outline-none focus:border-none"
                alt=""
              />
            ) : (
              <img
                src="/img/State=Hover, Size=Desktop.png"
                className="h-10 border-none text-blue focus:outline-none hover:border-none hover:outline-none focus:border-none"
                alt=""
              />
              // <FontAwesomeIcon
              //   icon={faCirclePlay}
              //   className="h-10 border-none text-blue focus:outline-none hover:border-none hover:outline-none focus:border-none "
              // />
            )}
            <span className="absolute w-6 h-6 rounded-full bg-pink top-2 left-2 -z-10"></span>
          </button>
          <div className="relative">
            <button
              onClick={handleNextClick}
              className="h-4 m-0 border-none focus:outline-none hover:border-none hover:outline-none focus:border-none"
            >
              <FontAwesomeIcon
                icon={faArrowRotateForward}
                className="h-5 border-none text-brown focus:outline-none hover:border-none hover:outline-none focus:border-none"
              />
            </button>
            {nextClicked && (
              <div className="absolute top-[2px] text-[10px] -right-6">+30</div>
            )}
          </div>
        </div>
      </div>

      {/* <p>
        Current Time: {currentTime.toFixed(2)} seconds (
        {duration ? ((currentTime / duration) * 100).toFixed(2) : 0}%)
      </p> */}
    </div>
  );
};

export default CustomAudioPlayer;
