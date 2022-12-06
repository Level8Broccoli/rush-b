import { h } from "preact";
import { GuiEvents, UpdateGuiEvent } from "../state/stateEvents";
import { OpenGame, User } from "../state/stateTypes";
import classes from "./View.module.css";

type Props = {
  updateGuiEvent: UpdateGuiEvent;
  user: User;
  openGame?: OpenGame;
};

export function JoinedGameView(props: Props): JSX.Element {
  const abort = () => {
    props.updateGuiEvent([GuiEvents.ExitJoinedGame, null]);
  };
  return (
    <div class={`card ${classes.customCard}`}>
      <header class="card-header">
        <p class="card-header-title">
          Das Spiel von {props.openGame?.creator.name}
        </p>
      </header>
      <div class="card-content">
        <h1>
          <span class="has-text-info-dark">{props.openGame?.creator.name}</span>{" "}
          versus{" "}
          <span class="has-text-danger-dark">
            {props.openGame?.secondPlayer?.name ?? "[offen]"}
          </span>
        </h1>
        <small class={"has-text-grey-light"}>
          ID: {props.openGame?.id.value}
        </small>
      </div>
      <div class="card-footer">
        <a href="#" class="card-footer-item" onClick={abort}>
          Spiel verlassen
        </a>
      </div>
    </div>
  );
}
