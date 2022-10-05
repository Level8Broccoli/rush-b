import SockJS from "sockjs-client/dist/sockjs";
import {h} from "preact";

const webSocket = new SockJS(`${import.meta.env.DEV ? '//localhost:8080' : ''}/ws`);
export default webSocket;
