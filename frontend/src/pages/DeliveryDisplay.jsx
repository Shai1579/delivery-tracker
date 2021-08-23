import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { socketService } from "../services/socketService"
import { Map } from "../cmps/Map"
import { CountDown } from "../cmps/CountDown"
import { locationService } from "../services/locationService"

export function DeliveryDisplay() {

    const { id, lat, lng, estimatedTime, estimatedTimeTo, estimatedDate } = useParams()

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
    const timeTextString = estimatedTimeTo ? "בין השעות:" : "בשעה:";
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
                    <h1>איזה כיף! אנחנו נמשיך מכאן 🥳</h1>
                    <h4>ההזמנה בהכנה. יום לפני המשלוח הבשלן קונה מצרכים טריים, וביום המשלוח מבשל הכל, על המקום.</h4>
                    {estimatedDate && 
                    <h3> המשלוח יגיע בתאריך: <span>{estimatedDate}</span></h3>
                    }
                    {estimatedTime && 
                    <h3> {!estimatedDate && 'המשלוח יגיע ' } {timeTextString} <span>{estimatedTime}</span></h3>
                    }
                    <h4>ברגע שהאוכל יהיה מוכן, תיפתח כאן מפה עם מיקום השליח וספירה לאחור עד שיגיע!</h4>
                    <h3> </h3>
                    <h3> </h3>
                    <h3> </h3>
                    <h3> </h3>
                </section>
            }
        </main>
    )
}