import React, {useState} from 'react';
import io from 'socket.io-client';
import styled from 'styled-components'
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';

const Login = () => {

    const [username,setUsername] = useState("");
    const [room,setRoom] = useState("");
    const [flashMessage,setFlashMessage] = useState("");

    const onChange = (event) =>{
        const {target : {name,value}}= event;
        if(name === "username"){
            setUsername(value);
        }else if(name ==="room"){
            setRoom(value);
        }
    }

    const onLoginSubmit = (event) =>{
        event.preventDefault()
    }

    const onClick = (event) =>{
        if(username == ''){
            event.preventDefault()
            setFlashMessage('username을 입력 해주세요.')
        }else if(room == ''){
            event.preventDefault()
            setFlashMessage('room 번호를 입력 해주세요.')
        }else{
            localStorage.setItem('username', username);
            let hubo = [0,1,2,3,4,5,6,7,8,9]
            shuffle(hubo)
            localStorage.setItem('dap', hubo.slice(0,5).join(''));
        }
    }

    const shuffle = (array) =>{
        array.sort(() => Math.random() - 0.5);
    }

    return (
        <Grid container spacing={2}>
            <Grid xs={6} md={5}></Grid>
            <Grid item xs={6} md={2}>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                <link href="https://fonts.googleapis.com/css2?family=Gamja+Flower&display=swap" rel="stylesheet"></link>
                <Form onSubmit={onLoginSubmit}>
                    <Input name="username" type="username" placeholder="Username" required value={username} onChange={onChange}></Input>
                    <Input name="room" required value={room} placeholder="Room Number" onChange={onChange}></Input>
                    <LinkStyle to={`/room/${room}`} onClick={onClick}>Login</LinkStyle>
                    <FlashMessage>{flashMessage}</FlashMessage>
                </Form>
            </Grid>
            <Grid xs={6} md={5}></Grid>
        </Grid>
    );
}

export default Login;

const Form = styled.form`
margin-top:100px;
`

const Input = styled.input`
width: 100%;
height:35px;
align-items: center;
border-right:0px;
border-top:0px;
border-left:0px;
border-color: black;
background-color: transparent;
color:black;
::placeholder {
    color: black;
}
font-family: 'Gamja Flower', cursive;
font-size:20px;
`

const LinkStyle = styled(Link)`
    width: 100%;
    height: 35px;
    display:block;
    text-align: center;
    border-radius: 5px;
    border: 2px solid black;
    color:white;
    font-size: 20px;
    font-weight:400;
    background: linear-gradient(to right, #0872ff, #2985ff);
    margin-top: 20px;
    text-decoration: none;
    &:focus, &:active,&:hover {
        color:#0d4b9e;
    }
    font-family: 'Gamja Flower', cursive;
    font-size:24px;
`
const FlashMessage = styled.div`
color:red;
font-family: 'Gamja Flower', cursive;
`