import React, { memo, useCallback, useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import bikeIcon from '../assets/img/red-scooter.png'
import hungryIcon from '../assets/img/red-home.png'
import { GOOGLE_API_KEY } from '../config/config.js'

const containerStyle = {
  width: '100%',
  height: '100%'
};


function MyComponent({ coords, userPos }) {

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API_KEY
  })

  const [count, setCount] = useState(0)
  const [map, setMap] = useState(null)
  const [center, setCenter] = useState(null)
  const [zoom, setZoom] = useState(null)

  useEffect(() => {
    if (!center && coords && isLoaded) {
      setCenter(coords)
      setZoom(16)
    } else if (isLoaded && count > 4) {
      setCenter(coords)
      setCount(0)
    } else setCount(count + 1)
  }, [coords])
  
  const onLoad = useCallback(map => {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = useCallback(map => {
    setMap(null)
  }, [])

  return (isLoaded) ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker
        icon={bikeIcon}
        position={coords}
      />
      {userPos &&
        <Marker
          icon={hungryIcon}
          position={userPos}
        />
      }

      <></>
    </GoogleMap>
  ) : <></>
}

export const Map = memo(MyComponent)