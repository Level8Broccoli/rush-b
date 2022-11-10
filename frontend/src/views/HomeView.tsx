import { h } from "preact";
import { Events, UpdateEvent } from "../state/stateEvents";
import { Views } from "../state/stateTypes";
import imgUrl from "../assets/img.png";

type Props = {
  updateEvent: UpdateEvent;
};

export function HomeView(props: Props): JSX.Element {
  return (
    <>
      <h1>Home</h1>
      <img src={imgUrl} alt="" />
      <button onClick={() => props.updateEvent([Events.GoToView, Views.Lobby])}>
        Go To Lobby
      </button>
    </>
  );
}
