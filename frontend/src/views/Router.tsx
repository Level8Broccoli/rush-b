import { AppState, OpenGame, Views } from "../state/stateTypes";
import { HomeView } from "./HomeView";
import { LobbyView } from "./LobbyView";
import { GameView } from "./GameView";
import { h } from "preact";
import { UpdateGuiEvent } from "../state/stateEvents";
import { StateUpdater, useEffect, useState } from "preact/compat";
import { SendToServer } from "../api/ClientEventTypes";
import { YourGameView } from "./YourGameView";
import { JoinedGameView } from "./JoinedGameView";

type Props = {
  state: AppState;
  updateGuiEvent: UpdateGuiEvent;
  setSend: StateUpdater<SendToServer>;
};

export function Router(props: Props): JSX.Element {
  const [currentOpenGame, setCurrentOpenGame] = useState<OpenGame>();
  useEffect(() => {
    if (!props.state.currentOpenGameId) {
      return;
    }
    setCurrentOpenGame(() => {
      return props.state.openGames.find(
        (g) => g.id.value === props.state.currentOpenGameId?.value
      );
    });
  }, [props.state]);

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
    case Views.YourGame:
      return (
        <YourGameView
          updateGuiEvent={props.updateGuiEvent}
          user={props.state.user}
          openGame={currentOpenGame}
        />
      );
    case Views.JoinedGame:
      return (
        <JoinedGameView
          updateGuiEvent={props.updateGuiEvent}
          user={props.state.user}
          openGame={currentOpenGame}
        />
      );
    case Views.Game:
      return (
        <GameView state={props.state} updateGuiEvent={props.updateGuiEvent} />
      );
  }
}
