import React, { useState, useEffect, useRef } from "react";
import {
  YMaps,
  Map,
  Placemark,
  FullscreenControl,
  ZoomControl,
  Clusterer,
} from "@pbe/react-yandex-maps";
import { Cars2 } from "src/api-client";
import { useRecoilValue } from "recoil";
import { cityAtom } from "../../../src/atoms";
// import { ModalCard } from "../../../src/ModalCard";

interface Props {
  cars: Cars2[];
}

const OnMap: React.FC<Props> = ({ cars }) => {
  const city = useRecoilValue(cityAtom);
  const [isLoad, setIsLoad] = useState(false);
  // const [activeIndex, setActiveIndex] = useState(-1);
  const [coordinates, setCoordinates] = useState([55.76, 37.64]);
  const clustererRef = useRef(null);

  useEffect(() => {
    if (city && isLoad) {
      window.ymaps.geocode(city).then((res: any) => {
        const firstGeoObject = res.geoObjects.get(0);
        const coords = firstGeoObject!.geometry;
        if (coords) {
          const newCoordinates = coords._coordinates;
          setCoordinates(newCoordinates);
        }
      });
    }
  }, [city, isLoad]);

  const mapState = {
    center: coordinates,
    zoom: 9,
  };

  const handleClusterClick = (e: any) => {
    const target = e.get("target");
    console.log(target);
  };

  return (
    <>
      <YMaps
        query={{
          apikey: "77383c0f-1a86-4e22-8cb6-821d0b5c3e7e",
          suggest_apikey: "77383c0f-1a86-4e22-8cb6-821d0b5c3e7e",
          ns: "ymaps",
        }}
      >
        <Map
          modules={["geocode"]}
          state={mapState}
          onLoad={() => setIsLoad(true)}
        >
          <Clusterer
            options={{
              preset: "islands#ClusterIcons",
              groupByCoordinates: false,
            }}
            instanceRef={clustererRef}
            onClick={handleClusterClick}
          >
            {cars.map((car, index) => (
              <Placemark
                key={index}
                geometry={car.division!.coords?.split(",")}
              />
            ))}
          </Clusterer>
          <FullscreenControl />
          <ZoomControl />
        </Map>
      </YMaps>
      {/* {activeIndex !== -1 && <ModalCard car={cars[activeIndex]} />} */}
    </>
  );
};

export default OnMap;
