import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'

const KEY = 'd7eb1a4de8ad2268a7b69872a425f6db'

export const geo = {
    state: {
        isLoading: true,
        errorMessage: null,
        statusPermission: null,
        city: null,
        data: null
    },

    reducers: {
        changeState(state, data) {
            let newState = { ...state, ...data }
            return newState
        }
    },
    effects: dispatch => ({
        async getStatusPermission() {
            const { status } = await Permissions.getAsync(Permissions.LOCATION)
            await dispatch.geo.changeState({ statusPermission: status })
        },
        async setPermission() {
            const { status } = await Permissions.askAsync(Permissions.LOCATION)
            if (status !== 'granted') {
                await dispatch.geo.changeState({
                    errorMessage:
                        'Вы отказали в доступе к данным местоположения!',
                    statusPermission: status
                })
            } else {
                await dispatch.geo.changeState({
                    errorMessage: null,
                    statusPermission: status
                })
                await dispatch.geo.getWeather()
            }
        },
        async getWeather() {
            await dispatch.geo.changeState({ isLoading: true })
            
            try {
                let location = await Location.getCurrentPositionAsync({})
                let [{city}] = await Location.reverseGeocodeAsync({latitude:location.coords.latitude, longitude: location.coords.longitude})
                const response = await fetch(
                    `https://api.darksky.net/forecast/${KEY}/${location.coords.latitude},${location.coords.longitude}?exclude=minutely,hourly,daily,alerts,flags&lang=ru&units=si`
                )
                if (response.status != 200) {
                    await dispatch.geo.changeState({
                        data: null,
                        city:null,
                        errorMessage: 'Произошла ошибка, повторите попытку',
                        isLoading: false
                    })
                } else {
                const data = await response.json()
                await dispatch.geo.changeState({
                    data: data.currently,
                    isLoading: false,
                    city
                })}
            } catch (error) {
                await dispatch.geo.changeState({
                    data: null,
                    city:null,
                    errorMessage: 'Произошла ошибка, повторите попытку',
                    isLoading: false
                })
            }
        }
    })
}
