import {CountdownCircleTimer} from 'react-countdown-circle-timer'
export function CountDown({sec, isCounting, setIsCounting, getDirections}) {
    const renderTime = ({ remainingTime }) => {

        if (remainingTime < 120) {
            getDirections()
        }
        if (remainingTime === 0) {
            return <div className="timer">Too lale...</div>
        }

        return (
            <div className="timer">
                <div className="value">{Math.ceil(remainingTime / 60)}</div>
                <div className="text">דקות</div>
            </div>
        )
    }

    return (
        <div className="timer-wrapper flex center">
            <CountdownCircleTimer
                isPlaying={isCounting}
                duration={sec}
                colors={[["#fff"]]}
                onComplete={() => setIsCounting(false)}
            >
                {renderTime}
            </CountdownCircleTimer>
        </div>
    )
}