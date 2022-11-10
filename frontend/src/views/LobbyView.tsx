import { h } from "preact";
import { Events, UpdateEvent } from "../state/stateEvents";
import { Views } from "../state/stateTypes";

type Props = {
  updateEvent: UpdateEvent;
};

export function LobbyView(props: Props): JSX.Element {
  return (
    <>
      <h1>Lobby</h1>
      <button onClick={() => props.updateEvent([Events.GoToView, Views.Home])}>
        Back To Home
      </button>
      <button onClick={() => props.updateEvent([Events.GoToView, Views.Game])}>
        To Game View
      </button>
    </>
  );
}
