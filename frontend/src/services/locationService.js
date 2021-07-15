import Axios from 'axios'
import { GOOGLE_API_KEY } from '../config/config'
import { httpService } from './httpService'
const axios = Axios.create({
    withCredentials: true
})

export const locationService = {
    setCoords,
    getDirections,
}

async function setCoords(coords) {
    try {
        await httpService.post('coord', { coords })
    } catch (err) {
        throw err
    }
}
async function getDirections(userPos, delivererPos) {
    const userPosStr = `${userPos.lat}%2f${userPos.lng}`
    const delivererPosStr = `${delivererPos.lat}%2f${delivererPos.lng}`
    try {
        await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${delivererPosStr}&destination=${userPosStr}&key=${GOOGLE_API_KEY}`, {
            transformRequest: (data, headers) => {
                delete headers.common['Authorization', 'Access-Control-Allow-Origin'];
                return data;
            }
        })
    } catch (err) {
        throw err
    }
}