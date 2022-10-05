import {h} from "preact";
import {useEffect, useState} from "preact/compat";
import webSocket from "../../websocket/websocket";


export function Chat() {
    const [messages, setMessages] = useState<String[]>(["Start of Log"]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        webSocket.onopen = function () {
            setMessages((prev) => ([...prev, "Connected to backend"]))
            webSocket.send(JSON.stringify({type: "subscribe", data: String(Math.floor(Math.random() * 12))}))
        };

        webSocket.onmessage = function (e: { data: string; }) {
            setMessages((prev) => ([...prev, "Message received: " + e.data]))
        };

        webSocket.onclose = function () {
            setMessages((prev) => ([...prev, "Connection closed"]))
        };
    }, [])

    const onSubmit = (e: Event) => {
        e.preventDefault()
        if (message.length) {
            webSocket.send(JSON.stringify({type: "message", data: message}))
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
