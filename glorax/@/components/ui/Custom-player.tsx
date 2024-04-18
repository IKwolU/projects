import React, {
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  MouseEventHandler,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
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
      <div className="flex flex-col items-center px-8 pt-4 pb-6 space-y-4 shadow-md rounded-3xl bg-lightblue">
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
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onMouseDown={handleSeekStart}
          onMouseUp={handleSeekEnd}
          onChange={handleSeek}
          className="w-full h-1 rounded appearance-none bg-blue"
        />
      </div>
      {/* <p>
        Current Time: {currentTime.toFixed(2)} seconds (
        {duration ? ((currentTime / duration) * 100).toFixed(2) : 0}%)
      </p> */}
    </div>
  );
};

export default CustomAudioPlayer;
