import React from 'react'
import { init } from '@rematch/core'
import * as models from './models'
import { Provider } from 'react-redux'
import Weather from './components/weather'
const store = init({
    models
})

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Weather />
            </Provider>
        )
    }
}
