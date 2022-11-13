import { AppState, Views } from "../state/stateTypes";
import { HomeView } from "./HomeView";
import { LobbyView } from "./LobbyView";
import { GameView } from "./GameView";
import { h } from "preact";
import { UpdateGuiEvent } from "../state/stateEvents";
import { StateUpdater } from "preact/compat";
import { SendToServer } from "../api/ClientEventTypes";
import { GameConfigView } from "./GameConfigView";

type Props = {
  state: AppState;
  updateGuiEvent: UpdateGuiEvent;
  setSend: StateUpdater<SendToServer>;
};

export function Router(props: Props): JSX.Element {
  switch (props.state.view) {
    case Views.Home:
      return (
        <HomeView
          updateGuiEvent={props.updateGuiEvent}
          setSend={props.setSend}
          user={props.state.user}
        />
      );
    case Views.Lobby:
      return (
        <LobbyView
          updateGuiEvent={props.updateGuiEvent}
          openGames={props.state.openGames}
          user={props.state.user}
        />
      );
    case Views.GameConfig:
      return (
        <GameConfigView
          updateGuiEvent={props.updateGuiEvent}
          user={props.state.user}
        />
      );
    case Views.Game:
      return (
        <GameView state={props.state} updateGuiEvent={props.updateGuiEvent} />
      );
  }
}
