import SockJS from "sockjs-client/dist/sockjs";
import {h} from "preact";
import {useEffect, useState} from "preact/compat";


export function App() {
    const [messages, setMessages] = useState<String[]>(["Start of Log"]);
    const [message, setMessage] = useState("");
    const webSocket = new SockJS(`${import.meta.env.DEV ? '//localhost:8080' : ''}/ws`);

    useEffect(() => {
        webSocket.onopen = function () {
            setMessages((prev) => ([...prev, "Connected to backend"]))
            webSocket.send(JSON.stringify({type: "subscribe", data: String(Math.floor(Math.random() * 12))}))
        };

        webSocket.onmessage = function (e) {
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
            <h1>Demo</h1>
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
