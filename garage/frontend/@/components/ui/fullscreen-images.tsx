import { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "./button";

interface FullScreenImagesProps {
  images: string[];
  fullscreenIndex: number;
  trigger: JSX.Element;
  openIsAffordable: boolean;
}

const FullScreenImages = ({
  images,
  fullscreenIndex,
  trigger,
  openIsAffordable,
}: FullScreenImagesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);
  const isTransitioning = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    initialSlide: fullscreenIndex,
    beforeChange: () => {
      isTransitioning.current = true;
    },
    afterChange: (current: any) => {
      isTransitioning.current = false;
      setActiveIndex(current);
    },
  };

  const handlePaginationClick = (index: number) => {
    if (sliderRef.current && index !== activeIndex) {
      sliderRef.current.slickGoTo(index);
      setActiveIndex(index);
      isTransitioning.current = true;
    }
  };

  return (
    <>
      {isOpen && openIsAffordable && (
        <div className="fixed top-0 left-0 z-[53] w-full h-full bg-black bg-opacity-95">
          <div className="relative flex flex-col justify-center h-full m-auto">
            {images.length > 1 && (
              <Slider ref={sliderRef} {...settings}>
                {images.map((image, index) => (
                  <div
                    className="flex items-center content-center h-96 md:h-screen md:w-screen"
                    key={index}
                  >
                    <img
                      onClick={() => setIsOpen(false)}
                      src={image}
                      alt={`Slide ${index}`}
                      className="object-contain h-full m-auto sm:min-w-full md:h-screen md:w-screen"
                    />
                  </div>
                ))}
              </Slider>
            )}
            {images.length === 1 && (
              <img
                onClick={() => setIsOpen(false)}
                src={images[0]}
                alt={`Slide ${1}`}
                className="object-contain h-full m-auto sm:min-w-full md:h-screen md:w-screen"
              />
            )}
            {images.length > 1 && (
              <div className="flex justify-center px-1 py-1 mt-2 sm:m-auto sm:space-x-2 -bottom-20 sm:justify-start sm:w-1/2 md:hidden">
                {images.map((x, i) => (
                  <div
                    key={`image_${i}`}
                    className={`w-full flex items-center bg-white rounded-xl transition-all h-24 ${
                      i === activeIndex
                        ? "shadow border-2 border-yellow"
                        : "scale-90"
                    }`}
                    onClick={() => handlePaginationClick(i)}
                  >
                    <img
                      className="object-cover w-full h-full rounded-xl"
                      src={x}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="fixed bottom-0 flex w-full p-2">
              {" "}
              <Button
                className="mx-auto sm:max-w-[250px]"
                onClick={() => setIsOpen(false)}
              >
                Назад
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="" onClick={() => setIsOpen(true)}>
        {trigger}
      </div>
    </>
  );
};

export default FullScreenImages;
