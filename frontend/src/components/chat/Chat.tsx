import { h } from "preact";
import { useState } from "preact/compat";
import { Events, UpdateEvent } from "../../state/stateEvents";

type Props = {
  updateEvent: UpdateEvent;
};

export function Chat(props: Props): JSX.Element {
  const [message, setMessage] = useState("");
  const onSubmit = (e: Event) => {
    e.preventDefault();
    if (message.length) {
      props.updateEvent([Events.SendMessages, [message]]);
      setMessage("");
    }
  };

  return (
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
  );
}
