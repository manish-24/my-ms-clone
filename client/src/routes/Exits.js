import React from 'react'

const Exits = (props) => {
    const goHome = () =>{
        props.history.push('/')
    }
    
    return (
        <div>
            <button onClick ={goHome}>Home</button>
        </div>
    )
}

export default Exits
