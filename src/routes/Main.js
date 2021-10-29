import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import Grid from '@mui/material/Grid';

const socket =  io.connect('http://localhost:4000')

const Main = () => {
    const username = localStorage.getItem('username')
    const dap = localStorage.getItem('dap')
    const room = window.location.href.split("room/")[1];
    const [chat,setChat] = useState([]);
    const [message,setMessage] = useState('');

    useEffect(() =>{
        socket.emit('join', {username,room}, (error) =>{
            if(error){
                alert('error!!')
            }
        })

    },[])

    useEffect(() =>{
        socket.on('adminMessage',({username,room}) =>{
            setChat([...chat,`${username} 님 ${room} 번 방에 오신 것을 환영합니다.`])
        })
        socket.on('message',({username, room, message}) =>{
            setChat([...chat,`${username} : ${message}`])
        })
        socket.on('gameMessage',(message) =>{
            setChat([...chat,`admin : ${message}`])
        })
        console.log('hi')
    },[chat])


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
        return chat.map((text) =>{
            return <div>{text}</div>
        })
    }


    return (
        <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
            </Grid>
            <Grid item xs={6} md={4}>
                {renderChat()}
                <form onSubmit={onSubmitMessage}>
                    <input name='message' value={message} onChange={onChangeMessage}></input>
                    <input type="submit" value={"Send"} />
                </form>
            </Grid>
        </Grid>
    );
}

export default Main;
