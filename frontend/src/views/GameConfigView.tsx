import { h } from "preact";
import { GuiEvents, UpdateGuiEvent } from "../state/stateEvents";
import { User, Views } from "../state/stateTypes";
import classes from "./GameConfigView.module.css";

type Props = {
  updateEvent: UpdateGuiEvent;
  user: User;
};

export function GameConfigView(props: Props): JSX.Element {
  return (
    <div class={`card ${classes.gameConfigCard}`}>
      <header class="card-header">
        <p class="card-header-title">Dein Spiel</p>
      </header>
      <div class="card-content">{props.user.name}</div>
      <div class="card-footer">
        <a
          href="#"
          class="card-footer-item"
          onClick={() => props.updateEvent([GuiEvents.GoToView, Views.Lobby])}
        >
          oder trette einem anderen Spiel bei, {props.user.name}
        </a>
      </div>
    </div>
  );
}
