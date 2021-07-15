import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { socketService } from "../services/socketService"
import { Map } from "../cmps/Map"
import { locationService } from "../services/locationService"
 
export function DeliveryDisplay() {
    const { id, lat, lng } = useParams()
    const [coords, setCoords] = useState(null)
    const [userLocation, setUserLocation] = useState(null)
    const [isShowDir, setIsShowDir] = useState(false)

    useEffect(() => {
        navigator.geolocation?.getCurrentPosition(({ coords }) => {
            let location = `${coords.latitude}%2f${coords.longitude}`
            setUserLocation(location)
            setIsShowDir(true)
        })
        socketService.setup()
        socketService.emit('register customer', id)
        socketService.on('new coords', async(newCoords) => {
            if (!coords){
                const directions = await locationService.getDirections({lat, lng}, newCoords)
                console.log(directions);
            }
            setCoords(newCoords)
        })

        return () => {
            socketService.off('new coords')
            socketService.terminate()
        }
    }, [id])

    useEffect(() => {
        if (!userLocation) return
        const [userLat, userLng] = userLocation.split('%2f')
        console.log(Math.abs(coords.lat - userLat), Math.abs(coords.lng - userLng));
        if (coords && (Math.abs(coords.lat - userLat) < 0.1) && (Math.abs(coords.lng - userLng) < 0.1)) setIsShowDir(false)
    },[coords])

    return (
        <main className="delivery-display">
            <h1>display!!</h1>
            <pre>{JSON.stringify(coords)}</pre>
            {coords && (isShowDir ? 
                <iframe width="600" height="450" style={{border: 0}} loading="lazy" allowFullScreen 
                // src={`https://www.google.com/maps/embed/v1/directions?origin=${coords.lat}%2f${coords.lng}&destination=destination=${userLocation}&key=AIzaSyD_RtSmY40CDJvjkyKGMbNuDLl29MwbZyk`}></iframe>
                src={`https://www.google.com/maps/embed/v1/directions?origin=31.8064792%2f35.1672849&destination=destination=harel+mall+mevasseret&key=AIzaSyD_RtSmY40CDJvjkyKGMbNuDLl29MwbZyk`}></iframe>
                :
                <Map coords={coords}/>)
            }
        </main>
    )
}