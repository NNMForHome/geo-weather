import React, { Component } from 'react'
import {
    Text,
    View,
    Button,
    Image,
    ActivityIndicator,
    StyleSheet
} from 'react-native'
import { connect } from 'react-redux'

export const mapState = state => ({
    isLoading: state.geo.isLoading,
    errorMessage: state.geo.errorMessage,
    statusPermission: state.geo.statusPermission,
    data: state.geo.data,
    city: state.geo.city
})

export const mapDispatch = dispatch => ({
    changeState: (obj) => dispatch.geo.changeState(obj),
    getStatusPermission: () => dispatch.geo.getStatusPermission(),
    setPermission: () => dispatch.geo.setPermission(),
    getWeather: () => dispatch.geo.getWeather()
})

class getLoc extends Component {
    componentDidMount = async () => {
        const {
            getStatusPermission,
            setPermission,
            statusPermission,
            changeState
        } = this.props
        await getStatusPermission()
        if (statusPermission === 'granted') {
            await getWeather()
        } else {
            await setPermission()
            changeState({isLoading:false})
        }
    }

    render() {
        const {
            isLoading,
            errorMessage,
            statusPermission,
            setPermission,
            data,
            getWeather,
            city
        } = this.props
        if (isLoading)
            return (
                <View style={styles.spin}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Загрузка...</Text>
                </View>
            )
        return (
            <View style={styles.container}>
                {errorMessage != null && (
                    <Text style={{ color: 'red' }}>{errorMessage}</Text>
                )}
                {statusPermission !== 'granted' ? (
                    <Button
                        title="Получить доступ к местоположению"
                        onPress={setPermission}
                    />
                ) : (
                    <View>
                        {data != null && (
                            <View>
                                <View style={[styles.inline,{justifyContent:'center'}]}>
                                    <Text>Погода в {city}: </Text>
                                    <Text style={{ fontWeight: 'bold' }}>
                                        {data.summary}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Image
                                        source={{
                                            uri: `https://darksky.net/images/weather-icons/${data.icon}.png`
                                        }}
                                        style={{ width: 128, height: 128 }}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            alignSelf: 'center',
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        <View style={styles.inline}>
                                            <Text>Температура: </Text>
                                            <Text
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                {Math.round(data.temperature)}{' '}
                                                ˚C
                                            </Text>
                                        </View>

                                        <View style={styles.inline}>
                                            <Text>Скорость ветра: </Text>
                                            <Text
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                {Math.round(data.windSpeed)} м/с
                                            </Text>
                                        </View>

                                        <View style={styles.inline}>
                                            <Text>Видимость: </Text>
                                            <Text
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                {Math.round(data.visibility)}+
                                                км
                                            </Text>
                                        </View>

                                        <View style={styles.inline}>
                                            <Text>Давление: </Text>
                                            <Text
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                {Math.round(data.pressure)} гПа
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                        <Button title="Обновить данные" onPress={getWeather} />
                    </View>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    spin: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inline: { flexDirection: 'row', flexWrap: 'wrap' }
})

export default connect(mapState, mapDispatch)(getLoc)
