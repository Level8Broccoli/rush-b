import { AppState, Views } from "../state/stateTypes";
import { HomeView } from "./HomeView";
import { LobbyView } from "./LobbyView";
import { GameView } from "./GameView";
import { h } from "preact";
import { UpdateEvent } from "../state/stateEvents";
import { StateUpdater } from "preact/compat";
import { SendToServer } from "../server/serverTypes";
import { GameConfigView } from "./GameConfigView";

type Props = {
  state: AppState;
  updateEvent: UpdateEvent;
  setSend: StateUpdater<SendToServer>;
};

export function Router(props: Props): JSX.Element {
  switch (props.state.view) {
    case Views.Home:
      return (
        <HomeView
          updateEvent={props.updateEvent}
          setSend={props.setSend}
          user={props.state.user}
        />
      );
    case Views.Lobby:
      return (
        <LobbyView
          updateEvent={props.updateEvent}
          openGames={props.state.openGames}
          user={props.state.user}
        />
      );
    case Views.GameConfig:
      return (
        <GameConfigView
          updateEvent={props.updateEvent}
          openGames={props.state.openGames}
          user={props.state.user}
        />
      );
    case Views.Game:
      return <GameView state={props.state} updateEvent={props.updateEvent} />;
  }
}
