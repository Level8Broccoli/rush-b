import { h } from "preact";
import classes from "./View.module.css";
import { Button } from "../components/general/Button";
import { GuiEvents, UpdateGuiEvent } from "../state/stateEvents";
import { FinishedGameState, Views } from "../state/stateTypes";

type Props = {
  updateGuiEvent: UpdateGuiEvent;
  finishedGame: FinishedGameState;
};

export function FinishedGameView(props: Props): JSX.Element {
  const goToLobby = () => {
    props.updateGuiEvent([GuiEvents.GoToView, Views.Lobby]);
  };

  return (
    <div class={`card ${classes.customCard}`}>
      <header class="card-header">
        <p class="card-header-title">Spiel beendet</p>
      </header>
      <div class="card-content">
        <h2 class="has-text-centered">
          <span class="has-text-info-dark">
            {props.finishedGame.player1.user?.name}
          </span>{" "}
          versus{" "}
          <span class="has-text-danger-dark">
            {props.finishedGame.player2.user?.name ?? "AI"}
          </span>
        </h2>
        <h1 class="has-text-centered is-size-1">
          <span class="has-text-info-dark">
            {props.finishedGame.player1.score}
          </span>{" "}
          :{" "}
          <span class="has-text-danger-dark">
            {props.finishedGame.player2.score}
          </span>
        </h1>
        <Button
          label="Zurück zur Lobby"
          variant={"black"}
          onClick={goToLobby}
        />
      </div>
    </div>
  );
}
