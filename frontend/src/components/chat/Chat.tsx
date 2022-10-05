import {h} from "preact";
import {useEffect, useState} from "preact/compat";


export function Chat(props: {socketRef: { current: WebSocket; }}) {
    const [messages, setMessages] = useState<String[]>(["Start of Log"]);
    const [message, setMessage] = useState("");
    const socket = props.socketRef.current;

    useEffect(() => {
        /*
        socket.onopen = function () {
            setMessages((prev) => ([...prev, "Connected to backend"]))
            socket.send(JSON.stringify({type: "subscribe", data: String(Math.floor(Math.random() * 12))}))
        };*/

        socket.onmessage = function (e: { data: string; }) {
            setMessages((prev) => ([...prev, "Message received: " + e.data]))
        };
/*
        socket.onclose = function () {
            setMessages((prev) => ([...prev, "Connection closed"]))
        };*/
    }, [])

    const onSubmit = (e: Event) => {
        e.preventDefault()
        if (message.length) {
            socket.send(JSON.stringify({type: "message", data: message}))
            setMessage("")
        }
    }

    return (
        <>
            <ul>
                {messages.map((m) => <li>{m}</li>)}
            </ul>
            <form action="" onSubmit={onSubmit}>
                <input name="message" value={message} type="text" onInput={(e) => {
                    if (e.target instanceof HTMLInputElement) {
                        setMessage(e.target.value);
                    }
                }}/>
                <button type="submit">Send</button>
            </form>
        </>
    )
}
