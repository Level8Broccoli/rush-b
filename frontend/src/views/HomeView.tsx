import { h } from "preact";
import { UpdateGuiEvent } from "../state/stateEvents";
import { Login } from "../components/login/Login";
import { StateUpdater } from "preact/compat";
import { SendToServer } from "../api/ClientEventTypes";
import { User } from "../state/stateTypes";

type Props = {
  user: User;
  updateEvent: UpdateGuiEvent;
  setSend: StateUpdater<SendToServer>;
};

export function HomeView(props: Props): JSX.Element {
  return (
    <>
      <Login
        updateEvent={props.updateEvent}
        setSend={props.setSend}
        user={props.user}
      />
    </>
  );
}
