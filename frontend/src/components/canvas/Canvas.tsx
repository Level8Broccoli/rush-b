import {createRef, h} from 'preact';
import {useEffect, useRef, useState} from "preact/compat";
import style from 'style.css'

type Props = {
    socketRef: { current: WebSocket; }
    tileMap: {tileSize: number; tiles: number[][]}
    character: {id: string, color: string, x: number, y: number}
}

export default function Canvas(props: Props) : JSX.Element {

    const [message, setMessage] = useState("");
    const socket = props.socketRef.current;
    const dataRef = useRef([])
    const canvasRef = createRef()

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d")
        const tileFactor = 0.8
        const tileSize = props.tileMap.tileSize * tileFactor

        ctx.clearRect(0,0,800,800)
        props.tileMap.tiles.forEach( (colElement, col) => {
            colElement.forEach((rowElement, row) => {
                if (props.tileMap.tiles[col][row] == 1) {
                    ctx.fillStyle = "black" //randomColor;
                    ctx.fillRect(col * tileSize * tileFactor, row * tileSize * tileFactor, tileSize * tileFactor, tileSize * tileFactor);
                } else {
                    ctx.fillStyle = "white";
                    ctx.fillRect(col * tileSize * tileFactor, row * tileSize * tileFactor, tileSize * tileFactor, tileSize * tileFactor);
                }
            })
        })
        ctx.fillStyle = props.character.color;
        ctx.fillRect(props.character.x, props.character.y , tileSize * tileFactor, tileSize * tileFactor);
    }, [props.character])



    const recordKeyStroke = (e: KeyboardEvent) => {
        e.preventDefault()
        setMessage(e.key)
        if (message.length) {
            socket.send(JSON.stringify({type: "keyPress", data: message}))
            setMessage("")
        }
    }

    return (
        <canvas tabIndex={0} onKeyDown={recordKeyStroke} ref={canvasRef} style={{ width: 600, height: 300 }} />
    )
}

