import {h} from "preact";
import {useEffect, useRef, useState} from "preact/compat";
import Canvas from "./components/canvas/Canvas";
import {Chat} from "./components/chat/Chat";
import {Keylogger} from "./shared/keylogger/keylogger";
import webSocket from "./shared/websocket/websocket";

export function App() {
    let stringList: String[] = [];
    const socketRef = useRef(webSocket);
    const pressedKeyRef = useRef(stringList);
    const [messages, setMessages] = useState<String[]>(["Start of Log"]);

    useEffect(() => {
        webSocket.onopen = function () {
            webSocket.send(JSON.stringify({type: "subscribe", data: String(Math.floor(Math.random() * 12))}))
        };
        webSocket.onmessage = function (e: { data: string; }) {
            setMessages((prev) => ([...prev, "Message received: " + e.data]))
        };
        webSocket.onclose = function () {
        };
    }, [])
    const onKeyPress = (e: KeyboardEvent) => {
        console.log(e.key)
    }

    return (
        <>
            <h1 onKeyPress={onKeyPress}>rush-b</h1>
            <Canvas  socketRef={socketRef} />
            <Chat  socketRef={socketRef} messages={messages}/>
            <Keylogger   keyRef={pressedKeyRef}/>
        </>
    )
}
