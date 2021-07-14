import {httpService} from './httpService'

export const locationService = {
    setCoords
}

async function setCoords(coords) {
    try {
        await httpService.post('coord', {coords})
    } catch (err) {
        throw err
    }
}