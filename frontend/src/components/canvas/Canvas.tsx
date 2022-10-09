import { h } from 'preact';
import {useRef, useState} from "preact/compat";
import style from './style.css'
import useCanvas from "../../shared/hooks/useCanvas";


export default function Canvas(props: {socketRef: { current: WebSocket; }}) {

    const [message, setMessage] = useState("");
    const socket = props.socketRef.current;

    const dataRef = useRef([])

    function getData() {
        const data = dataRef.current
        let point
        if (data.length > 0) {
            point = dataRef.current.pop()
        }
        return point
    }

    const recordKeyStroke = (e: KeyboardEvent) => {
        e.preventDefault()
        setMessage(e.key)
        if (message.length) {
            socket.send(JSON.stringify({type: "keyPress", data: message}))
            setMessage("")
        }
    }

    return (
        <canvas tabIndex={0} onKeyDown={recordKeyStroke}  />
    )
}

