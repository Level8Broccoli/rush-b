import {h} from "preact";
import {useEffect, useRef, useState} from "preact/compat";
import {MutableRef} from "preact/hooks";

export function Keylogger(props: {
    keyRef: { current: String[]; }
}) {
    let keys = props.keyRef

    useEffect(() => {


    }, [])

    const onKeyPress = (e: KeyboardEvent) => {
        console.log(e.key)
        keys.current.join(e.key)
    }
    return (
        <div style={"backgroundColor:red"} onKeyPress={onKeyPress} id="keylogger" />
    )
}
