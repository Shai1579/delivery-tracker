import React, { memo, useCallback, useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import bikeIcon from '../assets/img/motorbike.png'
import {GOOGLE_API_KEY} from '../config.js'

const containerStyle = {
    width: '800px',
    height: '800px'
};


function MyComponent({coords}) {

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API_KEY
  })

  const [map, setMap] = useState(null)
  const [center, setCenter] = useState(null)
  const [zoom, setZoom] = useState(null)

  useEffect(() => {
      if (!center && coords && isLoaded) {
          setCenter(coords)
          setZoom(16)
        }
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
        { /* Child components, such as markers, info windows, etc. */ }
        <Marker
      icon={bikeIcon}
      position={coords}
    
    />
  
        <></>
      </GoogleMap>
  ) : <></>
}

export const Map = memo(MyComponent)