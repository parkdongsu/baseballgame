import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';

const socket =  io.connect('http://localhost:4000')

const Main = () => {
    const username = localStorage.getItem('username')
    const dap = localStorage.getItem('dap')
    const room = window.location.href.split("room/")[1];
    const [chat,setChat] = useState([]);
    const [message,setMessage] = useState('');
    const scrollRef = useRef();

    useEffect(() =>{
        scrollRef.current.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' });
    },[chat])


    useEffect(() =>{
        socket.emit('join', {username,room}, (error) =>{
            if(error){
                alert('error!!')
            }
        })

        socket.on('joinRoom',({username,room}) =>{
            setChat(oldChat => [...oldChat,`${username} 님 ${room} 번 방에 오신 것을 환영합니다.`])
        })
        socket.on('leaveRoom',({username,room}) =>{
            setChat(oldChat => [...oldChat,`${username} 님이 ${room} 번 방에서 퇴장하셨습니다.`])
        })
        socket.on('message',({username, room, message}) =>{
            setChat(oldChat => [...oldChat,`${username} : ${message}`])
        })
        socket.on('gameMessage',(message) =>{
            setChat(oldChat => [...oldChat,`admin : ${message}`])
        })
        console.log(chat)
    },[])

    const onChangeMessage = (event) =>{
        const {target: {value}} = event;
        setMessage(value)
    }

    const onSubmitMessage = (event) =>{
        event.preventDefault()
        if(message.length ==5 & !isNaN(message)){
            socket.emit('gameMessage',{username, room, message, dap})
        }
        socket.emit('message',{username, room, message})
        setMessage('')
    }

    const renderChat = () =>{
        return chat.map((text, index) =>{
            return <div key={index}>{text}</div>
        })
    }

    const onClickexit = () =>{
        socket.emit('leave', {username,room}, (error) =>{
            if(error){
                alert('error!!')
            }
        })
        
    }




    return (
        <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
            </Grid>
            <Grid direction="column" item xs={6} md={4}>
                <Grid item xs={4}>
                    <Exit>
                    <LinkStyle to={`/`} onClick={onClickexit}>나가기</LinkStyle>
                    </Exit>
                </Grid>
                <Grid style={chatStyle} item xs={4}>
                    <div ref={scrollRef}>
                    {renderChat()}
                    </div>
                    
                </Grid>
                <Grid item xs={4}>
                    <form onSubmit={onSubmitMessage}>
                        <InputMessage name='message' value={message} onChange={onChangeMessage}></InputMessage>
                        <InputSubmit type="submit" value={"Send"} />
                    </form>
                </Grid>
                
                
            </Grid>
        </Grid>
    );
}

export default Main;

const Exit = styled.div`
float:right;
`

const LinkStyle = styled(Link)`
    width: 50px;
    height: 20px;
    display:block;
    margin-bottom: 10px;
    text-align: center;
    border: 1px solid black;
    color:white;
    font-size: 12px;
    background: linear-gradient(to right, #648f61, #446142);
    text-decoration: none;
    &:focus, &:active,&:hover {
        color:#0d4b9e;
    }
`

const chatStyle = {clear:'both', height:'400px', overflowY: 'auto', border: '1px solid black', background: 'white'}

const InputMessage = styled.input`
width: 78.7%;
`
const InputSubmit = styled.input`
width: 20%;
background: linear-gradient(to right, #648f61, #446142);
`