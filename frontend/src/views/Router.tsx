import { GameState, Views } from "../state/stateTypes";
import { HomeView } from "./HomeView";
import { LobbyView } from "./LobbyView";
import { GameView } from "./GameView";
import { h } from "preact";
import { SendMessage } from "../websocket/websocketTypes";
import { UpdateEvent } from "../state/stateEvents";

type Props = {
  state: GameState;
  updateEvent: UpdateEvent;
  send: SendMessage;
};

export function Router(props: Props): JSX.Element {
  switch (props.state.view) {
    case Views.Home:
      return <HomeView updateEvent={props.updateEvent} />;
    case Views.Lobby:
      return <LobbyView updateEvent={props.updateEvent} />;
    case Views.Game:
      return <GameView send={props.send} state={props.state} />;
  }
}
