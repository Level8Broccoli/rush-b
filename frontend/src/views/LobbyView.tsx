import { h } from "preact";
import { Events, UpdateEvent } from "../state/stateEvents";
import { GameList } from "../components/lobby/GameList";
import { OpenGame, User } from "../state/stateTypes";
import classes from "./LobbyView.module.css";

type Props = {
  updateEvent: UpdateEvent;
  openGames: OpenGame[];
  user: User;
};

export function LobbyView(props: Props): JSX.Element {
  return (
    <div class={`card ${classes.lobbyCard}`}>
      <header class="card-header">
        <p class="card-header-title">Lobby</p>
      </header>
      <div class="card-content">
        <GameList openGames={props.openGames} />
      </div>
      <div class="card-footer">
        <a
          href="#"
          class="card-footer-item"
          onClick={() =>
            props.updateEvent([Events.StartNewGame, props.user.id])
          }
        >
          oder starte ein eigenes Spiel, {props.user.name}
        </a>
      </div>
    </div>
  );
}
