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
import { Card } from "../../../src/Card";
import { Button } from "./button";

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

const OnMap: React.FC<Props> = ({ cars }) => {
  const city = useRecoilValue(cityAtom);
  const [isLoad, setIsLoad] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [clickedCars, setClickedCars] = useState<Cars2[]>([]);
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
    if (target && target.getGeoObjects) {
      const geoObjects = target.getGeoObjects();
      const clickedCars = cars.filter((car) => {
        const [lat, lon] = car.division!.coords!.split(",");
        return geoObjects.some((geoObj) => {
          const [geoLat, geoLon] = geoObj.geometry.getCoordinates();
          return lat === geoLat.toString() && lon === geoLon.toString();
        });
      });
      setClickedCars(clickedCars);
      setIsClicked(true);
    }
  };

  return (
    <>
      <YMaps
        query={{
          apikey: "77383c0f-1a86-4e22-8cb6-821d0b5c3e7e",
          suggest_apikey: "77383c0f-1a86-4e22-8cb6-821d0b5c3e7e",
        }}
      >
        <Map
          state={mapState}
          onLoad={() => setIsLoad(true)}
          width={"100%"}
          height={"75vh"}
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
      {isClicked && (
        <div className="fixed top-0 left-0 flex justify-center w-full h-full bg-black bg-opacity-95">
          <div className=" flex flex-wrap items-start justify-start w-full h-full gap-2 bg-lightgrey max-w-[744px] p-4 mx-auto overflow-y-auto pb-16">
            <div className="flex flex-wrap gap-2 md:justify-start ">
              {clickedCars.map((car) => {
                return <Card key={car.id} car={car} />;
              })}
            </div>
          </div>
          <div className="fixed bottom-0  flex w-full p-2 space-x-2 bg-white max-w-[744px] mx-auto">
            <Button
              className="sm:max-w-[250px] mx-auto"
              onClick={() => setIsClicked(false)}
            >
              Назад
            </Button>
          </div>
          <div className="fixed bottom-0  flex w-full p-2 space-x-2 bg-white max-w-[744px] mx-auto">
            <Button
              className="sm:max-w-[250px] mx-auto"
              onClick={() => setIsClicked(false)}
            >
              Назад
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default OnMap;
