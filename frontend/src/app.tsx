import {h} from "preact";
import {useEffect, useRef, useState} from "preact/compat";
import Canvas from "./components/canvas/Canvas";
import {Chat} from "./components/chat/Chat";
import {Keylogger} from "./helpers/keylogger/keylogger";
import SockJS from "sockjs-client/dist/sockjs";
import webSocket from "./helpers/websocket/websocket";

export function App() {
    //const webSocket = new SockJS(`${import.meta.env.DEV ? '//localhost:8080' : ''}/ws`);
    let stringList: String[] = [];
    const socketRef = useRef(webSocket);
    const pressedKeyRef = useRef(stringList);

    useEffect(() => {
        webSocket.onopen = function () {
            console.log("open")
            webSocket.send(JSON.stringify({type: "subscribe", data: String(Math.floor(Math.random() * 12))}))
        };

        webSocket.onclose = function () {
            console.log("close")
        };
    }, [])
    const onKeyPress = (e: KeyboardEvent) => {
        console.log(e.key)
    }

    return (
        <>
            <h1 onKeyPress={onKeyPress}>rush-b</h1>
            <Canvas  />
            <Chat  socketRef={socketRef}/>
            <Keylogger   keyRef={pressedKeyRef}/>
        </>
    )
}
