import { useEffect, useState, Fragment, useRef } from "react"
import { useParams } from "react-router"
import { socketService } from '../services/socketService'
import { locationService } from '../services/locationService'
import ReactNoSleep from 'react-no-sleep';

export function DeliveryTrack() {

    const { strIds } = useParams()
    const [isSharing, setIsSharing] = useState(false)
    const [socketErr, setSocketErr] = useState(null)
    const intervalId = useRef(null);

    useEffect(() => {
        socketService.setup()
        const ids = strIds?.split(',')
        socketService.emit('register deliverer', ids)
        return () => {
            clearInterval(intervalId.current)
            socketService.terminate()
        }
    }, [strIds, socketErr])

    const onToggleShareLocation = () => {
        if (isSharing) clearInterval(intervalId.current)
        else if (!navigator.geolocation) alert('Geolocation is not supported by this browser.')
        else {
            intervalId.current = setInterval(() => {
                navigator.geolocation.getCurrentPosition(onNewPos, (e) => {
                    clearInterval(intervalId.current)
                    alert('please enable location in your setting')
                });
            }, 10000)
            
        }
        setIsSharing(!isSharing)
    }

    const onNewPos = async ({ coords }) => {
        try {
            await locationService.setCoords({ lat: coords.latitude, lng: coords.longitude })
        }
        catch (err) {
            console.log('there has been an error');
            clearInterval(intervalId.current)
            setIsSharing(false)
            setTimeout(() => {
                setSocketErr({...err})
                onToggleShareLocation()
            },60000)
        }
    }

    return (
        <main className="delivery-track">
            <h1>Hi there delivery-men</h1>
            <ReactNoSleep>
                {({ isOn, enable, disable }) => (
                    <Fragment>
                        <h3>Your phone will {isOn ? 'not' : ''} stay awake</h3>
                        <button onClick={isOn ? disable : enable}>
                            {isOn ? 'on' : 'off'}
                        </button>
                    </Fragment>
                )}
            </ReactNoSleep>
            <h3>Your location {isSharing ? 'is shared now' : 'is not shared yet'}</h3>
            <button onClick={onToggleShareLocation}>{isSharing ? 'stop' : 'start'} sharing</button>
        </main>
    )
}