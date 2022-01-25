import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from './routes/room';
import Exits from './routes/Exits';
// import { Typography, AppBar } from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles'

// import VideoPlayer from './components/VideoPlayer'
// import Options from './components/Options'
// import Notification from './components/Notification'

// const useStyles = makeStyles((theme) => ({
//     appBar: {
//         borderRadius: 15,
//         margin: '30px 100px',
//         display: 'flex',
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '600px',
//         border: '2px solid black',
    
//         [theme.breakpoints.down('xs')]: {
//           width: '90%',
//         },
//       },
//       image: {
//         marginLeft: '15px',
//       },
//       wrapper: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         width: '100%',
//       },  

// }))


const App = () => {
    // const classes = useStyles()
    return (
        // <div className={classes.wrapper}>
        //     <AppBar className= {classes.appBar} position = "static" color="inherit">
        //         <Typography variant="h2" align="center">MS Teams</Typography>
        //     </AppBar>
        //     <VideoPlayer  />
        //     {/* <Options>
        //         <Notification />
        //     </Options> */}
        // </div>
        // <div>
          <BrowserRouter>
            <Switch>
              <Route path="/" exact component={CreateRoom} />
              <Route path="/room/:roomID" component={Room} />
              <Route path="/exits/" component={Exits} />
            </Switch>
          </BrowserRouter>

          /* <div className={classes.wrapper}>
           <AppBar className= {classes.appBar} position = "static" color="inherit">
              <Typography variant="h2" align="center">MS Teams</Typography>
           </AppBar>
          </div> 
        </div>  */
    )

}

export default App
