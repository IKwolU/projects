import { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FullScreenImages from "@/components/ui/fullscreen-images";

interface SliderImagesProps {
  images: string[];
  classImages: string;
  classPaginationImages: string;
  openIsAffordable: boolean;
  type: "click" | "hover";
}

const SliderImages = ({
  images,
  type,
  classImages,
  classPaginationImages,
  openIsAffordable = false,
}: SliderImagesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);
  const isTransitioning = useRef(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(-1);

  const settings = {
    dots: false,
    infinite: true,
    speed: type === "click" ? 500 : 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: () => {
      isTransitioning.current = true;
    },
    afterChange: (current: any) => {
      setFullscreenIndex(current);
      setActiveIndex(current);
      isTransitioning.current = false;
    },
  };

  const handlePaginationMouseEnterOrClick = (index: number) => {
    if (sliderRef.current && index !== activeIndex) {
      sliderRef.current.slickGoTo(index);
      setActiveIndex(index);
      isTransitioning.current = true;
    }
  };

  return (
    <>
      <div className={`relative h-64 sm:h-80 ${classImages}`}>
        {type === "click" && (
          <div className="absolute bottom-0 left-0 z-10 w-full h-1/4 md:h-32 rounded-b-xl bg-gradient-to-t from-black via-black to-transparent"></div>
        )}
        {!openIsAffordable && (
          <Slider ref={sliderRef} {...settings}>
            {images.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`Slide ${index}`}
                  className={`bg-black bg-opacity-90 object-cover w-full h-64 rounded-xl sm:min-w-full sm:h-80 ${classImages}`}
                />
              </div>
            ))}
          </Slider>
        )}
        <FullScreenImages
          trigger={
            openIsAffordable ? (
              <Slider ref={sliderRef} {...settings}>
                {images.slice(0, 3).map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`Slide ${index}`}
                      className={`bg-black bg-opacity-90 object-cover w-full h-64 rounded-xl sm:min-w-full sm:h-80 ${classImages}`}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="hidden"></div>
            )
          }
          fullscreenIndex={fullscreenIndex}
          images={images}
        />
        <div
          className={`absolute bottom-0 flex justify-center px-1 py-1 mt-2 sm:justify-start sm:w-1/2 w-60  z-10 ${classPaginationImages} ${
            type === "hover" && "h-full"
          }`}
        >
          {type === "click" &&
            images.slice(0, 3).map((x, i) => (
              <div
                key={`image_${i}`}
                className={`w-full flex items-center cursor-pointer bg-white rounded-xl transition-all h-14 sm:h-28 ${
                  i === activeIndex
                    ? "shadow border-2 border-yellow"
                    : "scale-90"
                } `}
                onClick={() => handlePaginationMouseEnterOrClick(i)}
                style={{
                  cursor: isTransitioning.current ? "default" : "default",
                }}
              >
                <img
                  className="object-cover w-full h-full cursor-pointer rounded-xl "
                  src={x}
                  alt=""
                />
              </div>
            ))}
          {type === "hover" && (
            <div className="flex w-full h-full max-h-full p-3 transition-opacity opacity-0 hover:opacity-100 ">
              {[0, 1, 2].map((i) => (
                <div
                  key={`image_${i}`}
                  className={`w-full flex items-end rounded-xl transition-all h-full cursor-pointer z-10  `}
                  onMouseEnter={() => handlePaginationMouseEnterOrClick(i)}
                >
                  <div
                    className={`w-full rounded-xl h-1 ${
                      i === activeIndex
                        ? "shadow  bg-white"
                        : "scale-90 bg-black bg-opacity-45"
                    }`}
                  ></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SliderImages;
