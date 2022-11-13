import { h } from "preact";
import { GuiEvents, UpdateGuiEvent } from "../state/stateEvents";
import { User, Views } from "../state/stateTypes";
import classes from "./GameConfigView.module.css";

type Props = {
  updateGuiEvent: UpdateGuiEvent;
  user: User;
};

export function GameConfigView(props: Props): JSX.Element {
  const abort = () => {
    props.updateGuiEvent([GuiEvents.DeleteOpenGame, null]);
    props.updateGuiEvent([GuiEvents.GoToView, Views.Lobby]);
  };

  return (
    <div class={`card ${classes.gameConfigCard}`}>
      <header class="card-header">
        <p class="card-header-title">Dein Spiel</p>
      </header>
      <div class="card-content">{props.user.name}</div>
      <div class="card-footer">
        <a href="#" class="card-footer-item" onClick={abort}>
          Abbrechen
        </a>
      </div>
    </div>
  );
}
