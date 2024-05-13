import React, {
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  MouseEventHandler,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import { currentTimeAtom } from "../../../src/atoms";
type CustomAudioPlayerProps = {
  src: string;
  active: boolean;
  onPlay: () => void;
};

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({
  src,
  onPlay,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [, setCurrentTime] = useRecoilState(currentTimeAtom);
  // const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [nextClicked, setNextClicked] = useState<boolean>(false);
  const [backClicked, setBackClicked] = useState<boolean>(false);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

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
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying((prevIsPlaying) => {
      const newIsPlaying = !prevIsPlaying;
      if (newIsPlaying) {
        onPlay();
      }
      return newIsPlaying;
    });
  };

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

  const handleSeekEnd: MouseEventHandler<HTMLInputElement> = (e) => {
    if (audioRef.current) {
      const seekTime =
        (parseInt(e.currentTarget.value) / 100) * audioRef.current!.duration;
      audioRef.current.currentTime = seekTime;
      // setCurrentTime(seekTime);
      setProgress(parseInt(e.currentTarget.value));
      setIsSeeking(false);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    if (isSeeking) {
      // const seekTime =
      // (parseInt(e.target.value) / 100) * audioRef.current!.duration;
      // setCurrentTime(seekTime);
      setProgress(parseInt(e.target.value));
    }
  };

  return (
    <div className="custom-audio-player">
      <div className="hidden">
        <audio
          ref={audioRef}
          src={src}
          controls
          // onLoadedMetadata={() => setDuration(audioRef.current!.duration)}
          className="hidden w-full h-auto appearance-none"
        ></audio>
      </div>
      <div className="flex flex-col items-center px-4 pt-4 pb-3 space-y-4 shadow-md rounded-3xl bg-lightblue">
        <div className="flex justify-between w-[90%]">
          <div className="relative ">
            <button
              onClick={handleBackClick}
              className="border-none focus:outline-none hover:border-none hover:outline-none focus:border-none"
            >
              <FontAwesomeIcon
                icon={faForward}
                className="h-12 rotate-180 border-none text-blue focus:outline-none hover:border-none hover:outline-none focus:border-none"
              />
            </button>
            {backClicked && (
              <div className="absolute -top-3 -left-2 text-zinc-600">-30</div>
            )}
          </div>
          <button
            onClick={handlePlayPause}
            className="border-none focus:outline-none hover:border-none hover:outline-none focus:border-none"
          >
            {isPlaying ? (
              <FontAwesomeIcon
                icon={faStop}
                className="h-12 border-none text-blue focus:outline-none hover:border-none hover:outline-none focus:border-none"
              />
            ) : (
              <FontAwesomeIcon
                icon={faPlay}
                className="h-12 border-none text-blue focus:outline-none hover:border-none hover:outline-none focus:border-none "
              />
            )}
          </button>
          <div className="relative">
            <button
              onClick={handleNextClick}
              className="border-none focus:outline-none hover:border-none hover:outline-none focus:border-none"
            >
              <FontAwesomeIcon
                icon={faForward}
                className="h-12 border-none text-blue focus:outline-none hover:border-none hover:outline-none focus:border-none"
              />
            </button>
            {nextClicked && (
              <div className="absolute -top-3 -right-2 text-zinc-600">+30</div>
            )}
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onMouseDown={handleSeekStart}
          onMouseUp={handleSeekEnd}
          onChange={handleSeek}
          className="w-full h-1 rounded appearance-none bg-blue w-[90%]"
        />
        <div className="flex items-center justify-between w-full text-sm">
          <span className="text-zinc-600">
            {audioRef.current
              ? `${String(
                  Math.floor(audioRef.current.currentTime / 60)
                ).padStart(2, "0")}:${String(
                  Math.floor(audioRef.current.currentTime % 60)
                ).padStart(2, "0")}`
              : "00:00"}
          </span>
          <span className="text-zinc-600">
            {audioRef.current
              ? `${String(Math.floor(audioRef.current.duration / 60)).padStart(
                  2,
                  "0"
                )}:${String(
                  Math.floor(audioRef.current.duration % 60)
                ).padStart(2, "0")}`
              : "00:00"}
          </span>
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
