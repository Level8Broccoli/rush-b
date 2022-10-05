import {h} from "preact";
import {useEffect, useRef, useState} from "preact/compat";
import Canvas from "./components/canvas/Canvas";
import {Chat} from "./components/chat/Chat";


export function App() {


    useEffect(() => {


    }, [])


    return (
        <>
            <h1>rush-b</h1>
            <Canvas />
            <Chat />
        </>
    )
}
