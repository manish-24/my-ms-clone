import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
// import {Redirect, BrowserRouter, Link} from 'react-router-dom';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css'
import styled from "styled-components";
import'./styles.css'

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 429px;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 50%;
    width: 50%;
`;


const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const [strm, setStrm] = useState()
    // var users_in = []
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;
    // var myVideoStream

    useEffect(() => {
        socketRef.current = io('http://localhost:5000')
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            setStrm(stream)
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                // users_in.push(users)
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
            
            socketRef.current.on('createMessage', mess => {
                // console.log(mess)
                document.getElementById("messShow").append(`User:${mess}`)

            })

        })
        // socketRef.current.emit('message', 'hello');
        // // socketRef.current.on('createMessage', (message) => {
        // //     console.log('myy', message)
        // // })
        // setUsers(users_in)
        
 
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }
    const just = (peersRef, mess) =>{
        peersRef.current.forEach(p =>{
            var idTo = p.peerID
            // console.log(idTo)

        socketRef.current.emit('message', { message: mess,id :idTo})}
        )

    }
    const juston = (mess) =>{
        just(peersRef, mess)
        

    }
    // socketRef.current.on('createMessage', mess => {
    //     console.log(mess)
    // // } )
    // let text = $("input");
    // // when press enter send message
    // $('html').keydown(function (e) {
    //   if (e.which == 13 && text.val().length !== 0) {
    //     console.log(text.val());
    //     text.val('')
    //   }
    // });

    // const just_input = document.getElementById("chat_message").value
    // console.log(just_input)
    const sendmess = () => {
        const just_input = document.getElementById("chat_message").value
        document.getElementById("messShow").append(`Me:${just_input}`)
        juston(just_input)

    }

    const playStop = () => {
        console.log('yeah.it pressed')
        console.log(strm.getVideoTracks()[0].enabled)
        let enabled = strm.getVideoTracks()[0].enabled;
        if (enabled) {
            strm.getVideoTracks()[0].enabled = false;
            setPlayVideo()
        } else {
            setStopVideo()
            strm.getVideoTracks()[0].enabled = true;
        }
      }

    const setStopVideo = () => {
        const html = `
        <i class="stop fas fa-video-slash"></i>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-camera-video-fill" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z"/>
                  </svg>
        `
        document.querySelector('.controls__video__button').innerHTML = html;
    }
      
    const setPlayVideo = () => {
        const html = `
        <i class="fas fa-video"></i>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-camera-video-off-fill" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l6.69 9.365zm-10.114-9A2.001 2.001 0 0 0 0 5v6a2 2 0 0 0 2 2h5.728L.847 3.366zm9.746 11.925-10-14 .814-.58 10 14-.814.58z"/>
                  </svg>
        `
        document.querySelector('.controls__video__button').innerHTML = html;
    }

    const muteUnmute = () => {
        const enabled = strm.getAudioTracks()[0].enabled;
        if (enabled) {
            strm.getAudioTracks()[0].enabled = false;
            setUnmuteButton();
        } else {
            setMuteButton();
            strm.getAudioTracks()[0].enabled = true;
        }
    }

    const setMuteButton = () => {
        const html = `
          <i class="unmute fas fa-microphone-slash"></i>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-mic-fill" viewBox="0 0 16 16">
                      <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
                      <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                    </svg>
        `
        document.querySelector('.controls__mute__button').innerHTML = html;
    }
      
    const setUnmuteButton = () => {
        const html = `
          <i class="fas fa-microphone"></i>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-mic-mute-fill" viewBox="0 0 16 16">
                      <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z"/>
                      <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"/>
                    </svg>
        `
        document.querySelector('.controls__mute__button').innerHTML = html;
    }

    const leaveMeet = () => {

        peersRef.current.forEach(p =>{
            p.peer.destroy()
            console.log('It destoried')})

        
        props.history.push('/exits/')
        // return(
        //     <BrowserRouter>
        // <Redirect  to="/exits/" />
        // </BrowserRouter>
        // )

        

    }

    return (
    <div class="body">
    <div class="controls">
        <button onClick={muteUnmute} class="controls__mute__button">
            {/* <i class="fas fa-microphone-slash"></i> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-mic-fill" viewBox="0 0 16 16">
            <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
            </svg>
        </button>
        <button onClick={playStop} class="controls__video__button">
            {/* <i class="fas fa-video"></i> */}
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-camera-video-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z"/>
             </svg>
        </button>
        <div>
                        <button onClick={leaveMeet} type="button" class="btn btn-danger">Hang Up</button>
                    </div>
    </div>
    <div class="main">
        <div class="main__left">
            <div class="main__videos">
                <Container className='col-md-2'>
                    <StyledVideo muted ref={userVideo} autoPlay playsInline />
                    {peers.map((peer, index) => {
                    return (
                        <Video key={index} peer={peer} />
                        );
                     })}
                </Container>
            </div>
            <div class="main__controls__block">
                <div class="main__controls__button">
                    <i class="fas fa-shield-alt"></i>
                    <span>Security</span>
                </div>
                <div class="main__controls__button">
                    <i class="fas fa-user-friends"></i>
                    <span>Participants</span>
                </div>
                <div class="main__controls__button">
                    <i class="fas fa-comment-alt"></i>
                    <span>Chat</span>
                </div>
            </div>

        </div>

        <div class="main__right">
            <div class="main__header">
                <h2>Chat</h2>
            </div>
            <div class="main__chat_window">
                <ul class="messages" id='messShow'>
               
                </ul>
                {/* <button onClick={juston}>Hello</button> */}
            </div>
            <div class="main__message_container">
                <input id="chat_message" type="text" placeholder="Type message here..."/>
                <button onClick={sendmess} className="btn btn-primary">send</button>
            </div>
        </div>
    </div>
    </div>
    );
    // const just_input = document.getElementById("chat_message").value
    // console.log(just_input)
};

export default Room;