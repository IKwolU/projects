import { useState, useEffect, useRef } from "react";
import {
  YMaps,
  Map,
  Placemark,
  FullscreenControl,
  ZoomControl,
  Clusterer,
} from "@pbe/react-yandex-maps";
import {
  Body15,
  CarClass,
  Cars3,
  FuelType,
  Schemas2,
  TransmissionType,
} from "../../../src/api-client";
import { useRecoilValue } from "recoil";
import { cityAtom } from "../../../src/atoms";
import citiesCoords from "../../../../backend/public/cities_coords.json";
import { Card } from "../../../src/Card";
import { Button } from "./button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faListUl } from "@fortawesome/free-solid-svg-icons";
import { client } from "../../../src/backend";

type CarFilter = {
  brands: string[];
  models: string[];
  parksName: string[];
  carClass: CarClass[];
  commission: number | null;
  fuelType: FuelType | null;
  transmissionType: TransmissionType | null;
  selfEmployed: boolean;
  buyoutPossible: boolean | undefined;
  schema: Schemas2 | null;
  sorting: "asc" | "desc";
  carVin: string | null;
  onMap: boolean;
  notStackList: string[] | undefined;
};

interface OnMapProps {
  filters: CarFilter;
  close: () => void;
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

const OnMap = ({ filters, close }: OnMapProps) => {
  const [cars, setCars] = useState<Cars3[]>([]);
  const city = useRecoilValue(cityAtom);
  const [isClicked, setIsClicked] = useState(false);
  const [clickedCars, setClickedCars] = useState<Cars3[]>([]);
  const [coordinates, setCoordinates] = useState([55.76, 37.64]);

  const clustererRef = useRef(null);

  const isFullScreen = filters.onMap;

  useEffect(() => {
    const getCars = async () => {
      const data = await client.searchCars(
        new Body15({
          brand: filters.brands,
          model: filters.models,
          park_name: filters.parksName,
          city,
          fuel_type: filters.fuelType || undefined,
          transmission_type: filters.transmissionType || undefined,
          car_class: filters.carClass,
          limit: 1000,
          offset: 0,
          sorting: filters.sorting,
          commission:
            filters.commission !== null ? filters.commission : undefined,
          self_employed: filters.selfEmployed,
          is_buyout_possible: filters.buyoutPossible,
          schemas: filters.schema || undefined,
          car_vin: filters.carVin || undefined,
        })
      );

      setCars(data.cars!);
      if (filters.brands.length > 0) {
        sessionStorage.clear();
      }
    };

    getCars();
  }, [filters, city]);

  useEffect(() => {
    if (city) {
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
  }, [city]);

  const mapState = {
    center: coordinates,
    zoom: 8,
  };

  const handleClusterClick = (e: any) => {
    const target = e.get("target");

    if (target) {
      if (target.getGeoObjects) {
        const geoObjects = target.getGeoObjects();
        const clickedCars = cars.filter((car) => {
          const [lat, lon] = car.division!.coords!.split(",");
          const tolerance = 0.0001;
          return geoObjects.some((geoObj: any) => {
            const [geoLat, geoLon] = geoObj.geometry.getCoordinates();
            return (
              Math.abs(Number(lat) - geoLat) < tolerance &&
              Math.abs(Number(lon) - geoLon) < tolerance
            );
          });
        });
        setClickedCars(clickedCars);
        setIsClicked(true);
      } else {
        const clickedCars = cars.filter((car) => {
          const [lat, lon] = car.division!.coords!.split(",");
          const [geoLat, geoLon] = target.geometry._coordinates;
          return lat === geoLat && lon && geoLon;
        });
        setClickedCars(clickedCars);
        setIsClicked(true);
      }
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
          width={"100%"}
          height={isFullScreen ? "75vh" : "0vh"}
        >
          <Clusterer
            options={{
              preset: "islands#ClusterIcons",
              groupByCoordinates: false,
            }}
            instanceRef={clustererRef}
            onClick={(e: any) => isFullScreen && handleClusterClick(e)}
            onTouchStart={(e: any) => isFullScreen && handleClusterClick(e)}
          >
            {cars.map((car) => {
              return (
                <Placemark
                  key={`${car.id}-${city}`}
                  geometry={car.division!.coords?.split(",")}
                  onClick={(e: any) => isFullScreen && handleClusterClick(e)}
                  onTouchStart={(e: any) =>
                    isFullScreen && handleClusterClick(e)
                  }
                />
              );
            })}
          </Clusterer>
          <FullscreenControl />
          <ZoomControl />
        </Map>
      </YMaps>
      {isFullScreen && (
        <div className="fixed flex w-full h-0 mx-auto left-4 bottom-14">
          <Button
            onClick={() => close()}
            className="w-24 h-10 bg-white shadow-md shadow-gray"
          >
            <div className="flex items-center mx-auto space-x-2 text-sm font-semibold">
              <FontAwesomeIcon icon={faListUl} className="w-4 h-4 m-0" />{" "}
              <span>Список</span>
            </div>
          </Button>
        </div>
      )}
      {isClicked && (
        <div className="fixed top-0 left-0 z-[50] flex justify-center w-full h-full bg-black lg:top-20 lg:bg-inherit bg-opacity-95">
          <div className=" flex flex-wrap items-start justify-center w-full h-full gap-2 bg-lightgrey lg:max-w-[1212px] max-w-[858px] scrollbar-hide lg:px-1 p-4 lg:pt-10 px-auto overflow-y-auto pb-16 lg:pb-0">
            <div className="fixed hidden lg:block left-0 w-full top-20 z-[53] pt-3 pb-1 bg-lightgrey ">
              <div
                className="flex items-center w-full mx-auto max-w-[1208px] cursor-pointer"
                onClick={() => setIsClicked(false)}
              >
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="h-5 mr-2 text-zinc-600"
                />
                Назад
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:grid md:grid-cols-2 lg:grid-cols-3">
              {clickedCars.map((car) => {
                return (
                  <div className="" key={car.id}>
                    <Card car={car} open={() => {}} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="fixed bottom-0 flex w-full p-2 lg:hidden space-x-2 bg-white max-w-[858px] lg:max-w-[1208px] mx-auto z-[50]">
            <Button
              variant={"outline"}
              className="sm:w-[250px] mx-auto"
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
