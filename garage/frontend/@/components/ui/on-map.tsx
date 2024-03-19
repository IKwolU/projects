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
import citiesCoords from "../../../../backend/public/cities_coords.json";

// import { ModalCard } from "../../../src/ModalCard";

interface Props {
  cars: Cars2[];
}
interface CityCoords {
  city_ru: string;
  population: string;
  lat: string;
  lon: string;
  region_name: string;
  region_iso_code: string;
  federal_district: string;
  city_en: string;
}
interface Props {
  citiesCoords: CityCoords[];
}

const OnMap: React.FC<Props> = ({ cars }) => {
  const city = useRecoilValue(cityAtom);
  const [isLoad, setIsLoad] = useState(false);
  // const [activeIndex, setActiveIndex] = useState(-1);
  const [coordinates, setCoordinates] = useState([55.76, 37.64]);
  const clustererRef = useRef(null);

  useEffect(() => {
    if (city && isLoad) {
      const newCoordinates = citiesCoords.find(
        (cityCoord: CityCoords) => cityCoord.city_ru === city
      );
      if (newCoordinates) {
        setCoordinates([
          Number(newCoordinates.lat),
          Number(newCoordinates.lon),
        ]);
      }
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
        }}
      >
        <Map state={mapState} onLoad={() => setIsLoad(true)}>
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
