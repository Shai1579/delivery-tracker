import { useEffect, useState, Fragment, useRef } from "react"
import { useParams } from "react-router"
import { socketService } from '../services/socketService'
import { locationService } from '../services/locationService'
import { Msg } from '../cmps/Msg'
import ReactNoSleep from 'react-no-sleep';
import connectionErrorSound from '../assets/sounds/connection-eror.wav';

export function DeliveryTrack() {
    const audio = new Audio();

    const { strIds } = useParams()
    const intervalId = useRef(null)

    const [isSharing, setIsSharing] = useState(false)
    const [msg, setMsg] = useState('')


    useEffect(() => {
        socketService.setup()
        const ids = strIds?.split(',')
        socketService.emit('register deliverer', ids)
        return () => {
            clearInterval(intervalId.current)
            socketService.terminate()
        }
    }, [strIds])

    const onToggleShareLocation = () => {
        audio.play()
        if (isSharing) clearInterval(intervalId.current)
        else if (!navigator.geolocation) alert('Geolocation is not supported by this browser.')
        else {
            getNewPos()
            intervalId.current = setInterval(getNewPos, 5000)
        }
        setIsSharing(!isSharing)
    }

    const getNewPos = () => {
        navigator.geolocation.getCurrentPosition(onNewPos, (e) => {
            clearInterval(intervalId.current)
            alert('please enable location in your setting')
        });
    }

    const onNewPos = async ({ coords }) => {
        try {
            await locationService.setCoords({ lat: coords.latitude, lng: coords.longitude })
        }
        catch (err) {
            console.log('there has been an error');
            clearInterval(intervalId.current)
            setIsSharing(false)
            setMsg('Lost connection, Please refresh!')
            audio.src = connectionErrorSound
            audio.setAttribute('loop', true)
            audio.play()
        }
    }

    return (
        <main className="delivery-track flex col center">
            {msg && <Msg msg={msg}/>}
            <h1>שלום לך שליח.ה</h1>
            <h3>תודה שאתה דואג לנו לאוכל חם!</h3>
            <h3>אתם באמת עושים עבודת קודש 😉</h3>
            <ReactNoSleep>
                {({ isOn, enable, disable }) => (
                    <Fragment>
                        <h3>המסך שלך {isOn ? '' : 'לא'} ישאר דלוק</h3>
                        <button onClick={isOn ? disable : enable} className={isOn ? 'deactivate' : 'activate'}>
                            {isOn ? ' כיבוי אוטומטי' : 'השאר דלוק'}
                        </button>
                    </Fragment>
                )}
            </ReactNoSleep>
            <h3>המיקום שלך {isSharing ? 'משותף עכשיו' : 'עוד לא משותף'}</h3>
            <button onClick={onToggleShareLocation} className={isSharing ? 'deactivate' : 'activate'}>{isSharing ? 'סייים ' : 'התחל '} שיתוף</button>
        </main>
    )
}