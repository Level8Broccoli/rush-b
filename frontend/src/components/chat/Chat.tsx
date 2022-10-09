import { h } from "preact";
import { useEffect, useState } from "preact/compat";

type Props = {
  socketRef: { current: WebSocket };
  messages: String[];
};

export function Chat(props: Props): JSX.Element {
  const [message, setMessage] = useState("");
  const socket = props.socketRef.current;

  useEffect(() => {}, []);

  const onSubmit = (e: Event) => {
    e.preventDefault();
    if (message.length) {
      socket.send(JSON.stringify({ type: "message", data: message }));
      setMessage("");
    }
  };

  return (
    <>
      <ul>
        {props.messages.map((m) => (
          <li>{m}</li>
        ))}
      </ul>
      <form action="" onSubmit={onSubmit}>
        <input
          name="message"
          value={message}
          type="text"
          onInput={(e) => {
            if (e.target instanceof HTMLInputElement) {
              setMessage(e.target.value);
            }
          }}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
