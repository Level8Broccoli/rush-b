import SockJS from "sockjs-client/dist/sockjs";

const webSocket = new SockJS(
  `${import.meta.env.DEV ? "//localhost:8080" : ""}/ws`
);
export default webSocket;
