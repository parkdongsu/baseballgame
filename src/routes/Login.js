import React, {useState} from 'react';
import io from 'socket.io-client';
import styled from 'styled-components'
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';

const Login = () => {

    const [username,setUsername] = useState("");
    const [room,setRoom] = useState("");

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
        localStorage.setItem('username', username);
    }

    return (
        <Grid container spacing={2}>
            <Grid xs={6} md={5}></Grid>
            <Grid item xs={6} md={2}>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link href="https://fonts.googleapis.com/css2?family=Signika+Negative:wght@300;400;600&display=swap" rel="stylesheet"/>
                <Form onSubmit={onLoginSubmit}>
                    <Input name="username" type="username" placeholder="Username" required value={username} onChange={onChange}></Input>
                    <Input name="room" required value={room} placeholder="Room" onChange={onChange}></Input>
                    <InputSummit type="submit" value={"Login"} />
                    <Link to={`/room/${room}`} onClick={onClick}>Login</Link>
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
`

const InputSummit = styled.input`
width: 100%;
height: 35px;
align-items: center;
border-radius: 5px;
color:black;
background: linear-gradient(to right, #0872ff, #2985ff);
margin-top: 20px;
`