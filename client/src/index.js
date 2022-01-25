import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
// import { ContextProvider } from './SocketContext'
import './styles.css'

ReactDOM.render(
    // <ContextProvider>
    //     <App />
    // </ContextProvider>,
    <React.StrictMode>
        <App />
  </React.StrictMode>,
 document.getElementById('root'))