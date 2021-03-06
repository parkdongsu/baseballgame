import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components'
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';

console.log(process.env.REACT_APP_MODE);
const socketURL = process.env.REACT_APP_MODE === 'development'
    ? 'http://localhost:4000'
    : 'http://testapi.rtrod.org:4000';
const socket = io.connect(socketURL);

const Main = () => {
    const username = localStorage.getItem('username');
    const dap = localStorage.getItem('dap');
    const room = localStorage.getItem('room');
    const [chat, setChat] = useState([]);
    const [gameChatAll, setGameChatAll] = useState([]);
    const [gameChatName, setGameChatName] = useState([]);
    const [gameChatQuestion, setGameChatQuestion] = useState([]);
    const [gameChatResultS, setGameChatResultS] = useState([]);
    const [gameChatResultB, setGameChatResultB] = useState([]);
    const [message, setMessage] = useState('');
    const scrollRef = useRef();
    const scrollRef2 = useRef();
    const [user, setUser] = useState([]);

    useEffect(() => {
        scrollRef.current.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' });
    }, [gameChatName])

    useEffect(() => {
        scrollRef2.current.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' });
    }, [chat])

    useEffect(() => {
        socket.emit('join', { username, room }, (error) => {
            if (error) {
                alert('error!!')
            }
        })

        socket.on('joinRoom', ({ username, room, users }) => {
            setChat(oldChat => [...oldChat, `${username} 님 ${room} 번 방에 오신 것을 환영합니다.`])
            setUser(users)
        })
        socket.on('leaveRoom', ({ username, room, users }) => {
            setChat(oldChat => [...oldChat, `${username} 님이 ${room} 번 방에서 퇴장하셨습니다.`])
            setUser(users)
        })
        socket.on('message', ({ username, message }) => {
            setChat(oldChat => [...oldChat, `${username} : ${message}`])
        })
        socket.on('gameMessage', ({ username, message, counts, countb }) => {
            setGameChatAll(oldChat => [...oldChat, { username: username, message: message, counts: counts, countb: countb }])
            setGameChatName(oldChat => [...oldChat, username])
            setGameChatQuestion(oldChat => [...oldChat, message])
            setGameChatResultS(oldChat => [...oldChat, counts])
            setGameChatResultB(oldChat => [...oldChat, countb])
        })

    }, [])

    const onChangeMessage = (event) => {
        const { target: { value } } = event;
        setMessage(value)
    }

    const onSubmitMessage = (event) => {
        event.preventDefault()
        if (message.length === 5 & !isNaN(message)) {
            socket.emit('gameMessage', { username, room, message, dap })
        }
        socket.emit('message', { username, room, message })
        setMessage('')
    }

    const renderChat = () => {
        return chat.map((text, index) => {
            return <TextMessage key={index}>{text}</TextMessage>
        })
    }

    const renderGameChat = () => {
        return (
            // <GameContainer>
            //     <NameContainer>
            //         {gameChatName.map((text, index) => {
            //             return <Name key={index}>{text}</Name>
            //         })}
            //     </NameContainer>
            //     <QuestionContainer>
            //         {gameChatQuestion.map((text, index) => {
            //             return <Question key={index}>{text}</Question>
            //         })}
            //     </QuestionContainer>
            //     <ResultContainer>
            //         {gameChatResultS.map((text, index) => {
            //             return <ResultS key={index}>{text}S</ResultS>
            //         })}
            //     </ResultContainer>
            //     <ResultContainer>
            //         {gameChatResultB.map((text, index) => {
            //             return <ResultB key={index}>{text}B</ResultB>
            //         })}
            //     </ResultContainer>
            // </GameContainer>
            user.map((user_element, user_index) => {
                return <Grid key={user_index}>
                    {gameChatAll.map((element, index) => {
                        if (element.username === user_element) {
                            return (
                                <GameContainer>
                                    <NameContainer>
                                        <Name key={'name' + index}>{element.username}</Name>
                                    </NameContainer>
                                    <QuestionContainer>
                                        <Question key={'message' + index}>{element.message}</Question>
                                    </QuestionContainer>
                                    <ResultContainer>
                                        <ResultS key={'results' + index}>{element.counts}S</ResultS>
                                    </ResultContainer>
                                    <ResultContainer2>
                                        <ResultB key={'resultb' + index}>{element.countb}B</ResultB>
                                    </ResultContainer2>
                                </GameContainer>
                            )
                        }
                    })}
                </Grid>
            })
        )
    }

    const renderUsers = () => {
        return user.map((text, index) => {
            return <Text key={index}>{text}</Text>
        })
    }

    const onClickexit = () => {
        socket.emit('leave', { username, room }, (error) => {
            if (error) {
                alert('error!!')
            }
        })
    }



    return (
        <Grid container spacing={1}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Gamja+Flower&display=swap" rel="stylesheet"></link>
            <Grid style={gameStyle} item xs={6} md={8}>
                <Title>누가 누가 잘하나~</Title>
                <Div ref={scrollRef}>
                    {renderGameChat()}
                </Div>
            </Grid>
            <Grid direction="column" item xs={6} md={4}>
                <Grid item xs={4}>
                    <Exit>
                        <LinkStyle to={`/`} onClick={onClickexit}>나가기</LinkStyle>
                    </Exit>
                </Grid>
                <Text>참가자</Text>
                <Grid style={userStyle} item xs={4}>
                    {renderUsers()}
                </Grid>
                <Text>채팅창</Text>
                <Grid style={chatStyle} item xs={4}>
                    <div ref={scrollRef2}>
                        {renderChat()}
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <form onSubmit={onSubmitMessage}>
                        <InputMessage name='message' value={message} onChange={onChangeMessage}></InputMessage>
                        <InputSubmit type="submit" value={"보내기"} />
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

const gameStyle = {
    height: '100vh',
    padding: '20px',
    overflowY: 'auto',
    border: '10px solid #c97c4f',
    background: '#18541c',
}

const Div = styled.div`
display: flex;
`

const Title = styled.div`
margin-bottom: 30px;
font-size:24px;
color: white;
font-family: 'Gamja Flower', cursive;
`

const GameContainer = styled.div`
display:flex;
`
const NameContainer = styled.div`
`
const QuestionContainer = styled.div`
`
const ResultContainer = styled.div`
`
const ResultContainer2 = styled.div`
margin-right:100px;
`
const Name = styled.div`
font-size:24px;
margin-right : 20px;
margin-bottom: 20px;
color: white;
font-family: 'Gamja Flower', cursive;
`
const Question = styled.div`
font-size:24px;
color: white;
margin-right : 20px;
margin-bottom: 20px;
font-family: 'Gamja Flower', cursive;
`
const ResultS = styled.div`
font-size:24px;
margin-bottom: 20px;
color:red;
font-family: 'Gamja Flower', cursive;
margin-right:5px;
`
const ResultB = styled.div`
font-size:24px;
margin-bottom: 20px;
color: #3eb546;
font-family: 'Gamja Flower', cursive;
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
    font-family: 'Gamja Flower', cursive;
    background: linear-gradient(to right, #648f61, #446142);
    text-decoration: none;
    &:focus, &:active,&:hover {
        color:#0d4b9e;
    }
`

const Text = styled.div`
font-size:24px;
font-family: 'Gamja Flower', cursive;
`

const TextMessage = styled.div`
font-size:16px;
font-family: 'Gamja Flower', cursive;
`

const userStyle = { clear: 'both', height: '95px', overflowY: 'auto', border: '1px solid black', background: 'white' }

const chatStyle = { clear: 'both', height: '400px', overflowY: 'auto', border: '1px solid black', background: 'white' }

const InputMessage = styled.input`
width: 78.7%;
font-family: 'Gamja Flower', cursive;
`
const InputSubmit = styled.input`
width: 19%;
background: linear-gradient(to right, #648f61, #446142);
color:white;
font-family: 'Gamja Flower', cursive;
`