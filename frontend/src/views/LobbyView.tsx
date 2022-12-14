import { h } from "preact";
import { GuiEvents, UpdateGuiEvent } from "../state/stateEvents";
import { GameList } from "../components/lobby/GameList";
import { OpenGame, User } from "../state/stateTypes";
import classes from "./View.module.css";

type Props = {
  updateGuiEvent: UpdateGuiEvent;
  openGames: OpenGame[];
  user: User;
};

export function LobbyView(props: Props): JSX.Element {
  const createOpenGame = () => {
    props.updateGuiEvent([GuiEvents.CreateOpenGame, null]);
  };

  return (
    <div class={`card ${classes.customCard}`}>
      <header class="card-header">
        <p class="card-header-title">Lobby</p>
      </header>
      <div class="card-content">
        <GameList
          openGames={props.openGames}
          updateGuiEvent={props.updateGuiEvent}
        />
      </div>
      <div class="card-footer">
        <a href="#" class="card-footer-item" onClick={createOpenGame}>
          oder starte ein eigenes Spiel, {props.user.name}
        </a>
      </div>
    </div>
  );
}
