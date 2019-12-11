import React from 'react'
import { init } from '@rematch/core'
import * as models from './models'
import { Provider } from 'react-redux'
import GetLoc from './components/getLoc'
const store = init({
    models
})

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <GetLoc />
            </Provider>
        )
    }
}
