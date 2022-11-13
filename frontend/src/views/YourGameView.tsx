import { h } from "preact";
import { GuiEvents, UpdateGuiEvent } from "../state/stateEvents";
import { OpenGame, User, Views } from "../state/stateTypes";
import classes from "./GameConfigView.module.css";
import { Button } from "../components/general/Button";

type Props = {
  updateGuiEvent: UpdateGuiEvent;
  user: User;
  openGame?: OpenGame;
};

export function YourGameView(props: Props): JSX.Element {
  const abort = () => {
    props.updateGuiEvent([GuiEvents.DeleteOpenGame, null]);
    props.updateGuiEvent([GuiEvents.GoToView, Views.Lobby]);
  };

  return (
    <div class={`card ${classes.gameConfigCard}`}>
      <header class="card-header">
        <p class="card-header-title">Dein Spiel</p>
      </header>
      <div class="card-content">
        <h1>
          <span class="has-text-info-dark">{props.user.name}</span> versus{" "}
          <span class="has-text-danger-dark">
            {props.openGame?.secondPlayer?.name ?? "[offen]"}
          </span>
        </h1>
        <small class={"has-text-grey-light"}>
          ID: {props.openGame?.id.value}
        </small>
        <div class={"buttons mt-3"}>
          <Button label={"Spiel mit AI starten"} variant={"black"} />
          {props.openGame?.secondPlayer?.name && (
            <Button
              label={
                "Spiel gegen " + props.openGame?.secondPlayer?.name + " starten"
              }
            />
          )}
        </div>
      </div>
      <div class="card-footer">
        <a href="#" class="card-footer-item" onClick={abort}>
          Abbrechen
        </a>
      </div>
    </div>
  );
}
