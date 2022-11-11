import { h } from "preact";
import { UpdateEvent } from "../state/stateEvents";
import { Login } from "../components/login/Login";

type Props = {
  updateEvent: UpdateEvent;
};

export function HomeView(props: Props): JSX.Element {
  return (
    <>
      <Login />
    </>
  );
}
