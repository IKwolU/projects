import React from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { Cars2 } from "src/api-client";

interface Props {
  cars: Cars2[];
}

const OnMap: React.FC<Props> = ({ cars }) => (
  <YMaps>
    <Map defaultState={{ center: [55.75, 37.57], zoom: 9 }}>
      {cars.map((car, index) => (
        <Placemark
          key={index}
          geometry={car.address}
          properties={{ hintContent: car.name }}
        />
      ))}
    </Map>
  </YMaps>
);

export default OnMap;
