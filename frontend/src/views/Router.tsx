import { AppState, Views } from "../state/stateTypes";
import { HomeView } from "./HomeView";
import { LobbyView } from "./LobbyView";
import { GameView } from "./GameView";
import { h } from "preact";
import { UpdateEvent } from "../state/stateEvents";

type Props = {
  state: AppState;
  updateEvent: UpdateEvent;
};

export function Router(props: Props): JSX.Element {
  switch (props.state.view) {
    case Views.Home:
      return <HomeView updateEvent={props.updateEvent} />;
    case Views.Lobby:
      return (
        <LobbyView
          updateEvent={props.updateEvent}
          openGames={props.state.openGames}
          playerName={props.state.player.name}
        />
      );
    case Views.Game:
      return <GameView state={props.state} updateEvent={props.updateEvent} />;
  }
}
