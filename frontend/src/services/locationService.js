import { httpService } from './httpService'

export const locationService = {
    setCoords,
    getDirections
}

async function setCoords(coords) {
    try {
        await httpService.post('coord', { coords })
    } catch (err) {
        throw err
    }
}
async function getDirections(origin, destination) {
    try {
        const directions = await httpService.get(`directions/${origin.lat},${origin.lng}/${destination.lat},${destination.lng}`)
        return directions
    } catch (err) {
        throw err
    }
}


