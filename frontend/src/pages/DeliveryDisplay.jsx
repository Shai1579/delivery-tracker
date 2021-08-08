import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import { socketService } from "../services/socketService"
import { Map } from "../cmps/Map"
import { CountDown } from "../cmps/CountDown"
import { locationService } from "../services/locationService"

export function DeliveryDisplay() {

    const { id, lat, lng, astimatedTime } = useParams()

    const [coords, setCoords] = useState(null)
    const [directions, setDirections] = useState(null)
    const [timeLeft, setTimeLeft] = useState(null)
    const [isCounting, setIsCounting] = useState(true)

    useEffect(() => {
        socketService.setup()
        socketService.emit('register customer', id)
        socketService.on('new coords', onNewCoords)
        return () => {
            socketService.off('new coords')
            socketService.terminate()
        }
    }, [id])

    useEffect(() => {
        if (!directions && coords) onSetDirections(coords)
    }, [coords])

    const onNewCoords = (newCoords) => {
        setCoords(newCoords)
    }

    const onSetDirections = async (coords) => {
        if (directions) return
        const newDirections = await locationService.getDirections({ lat, lng }, coords)
        setDirections(newDirections.routes[0].legs[0])
        if (newDirections.endTime) setTimeLeft(newDirections.endTime - Date.now())
        else {
            const arrivalTime = Date.now() + newDirections.routes[0]?.legs[0].duration.value
            setTimeLeft(arrivalTime - Date.now())
        }
    }

    return (
        <main className="delivery-display">
            {coords && isCounting &&
                <div className="map-container">
                    <Map coords={coords} userPos={{ lat: +lat, lng: +lng }} />
                </div>
            }
            {directions && isCounting ?
                <section className="matrix-container">
                    <div className="timer flex center">
                        {timeLeft && <CountDown sec={(timeLeft / 1000)} isCounting={isCounting} setIsCounting={setIsCounting} getDirections={() => onSetDirections(coords)} />}
                    </div>
                </section>
                : coords && 
                <div className="finish flex col center">
                    <h2>האמת..</h2>
                    <h2>אנחנו קצת מקנאים בכם עכשיו🙁</h2>
                    <h1>בתיאבון!</h1>
                </div>
            }
            {!coords &&
                <section className="pre-display flex col center">
                    <h1>איזה כיף שאתם פה 🥳</h1>
                    <h3>ההזמנה שלכם בהכנה!</h3>
                    {astimatedTime && 
                    <h3>המשלוח יגיע עד השעה: <span>{astimatedTime}</span></h3>
                    }
                    <h4>ברגע שהאוכל יהיה מוכן תוכלו לראות את המיקום של השליח בלייב על המפה!</h4>
                    <h5>(אל תדאגו, אנחנו יודעים שאתם רעבים..)</h5>
                </section>
            }
        </main>
    )
}