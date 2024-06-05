import React, { useState, useEffect } from "react";

const MetroComponent = ({ address }: { address: string }) => {
  const [nearestMetro, setNearestMetro] = useState([]);

  useEffect(() => {
    const getNearestMetro = async (address: string) => {
      const apiKey = "77383c0f-1a86-4e22-8cb6-821d0b5c3e7e";
      const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${address}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const metroStations = [];

        if (data.response && data.response.GeoObjectCollection) {
          const features = data.response.GeoObjectCollection.featureMember;
          features.forEach((feature) => {
            if (
              feature.GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails
                .Metro
            ) {
              console.log(metroName);
              const metroName = feature.GeoObject.name;
              metroStations.push(metroName);
            }
          });
        }
        setNearestMetro(metroStations);
      } catch (error) {
        console.error("Error fetching data:", error);
        return [];
      }
    };

    getNearestMetro(address);
  }, []);

  return (
    <div>
      <h2>Nearest Metro Stations:</h2>
      <ul>
        {nearestMetro.map((station) => (
          <li key={station}>{station}</li>
        ))}
      </ul>
    </div>
  );
};

export default MetroComponent;
