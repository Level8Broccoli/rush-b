import { h } from "preact";
import { GameUI } from "../components/canvas/GameUI";
import { AppState } from "../state/stateTypes";
import { UpdateGuiEvent } from "../state/stateEvents";
import classes from "./View.module.css";

type Props = {
  state: AppState;
  updateGuiEvent: UpdateGuiEvent;
};

export function GameView(props: Props): JSX.Element {
  return (
    <div class={`card ${classes.customCard}`}>
      <div class={`card-content ${classes.centerChild}`}>
        <GameUI
          timer={props.state.activeGame.timer}
          tileMap={props.state.activeGame.level}
          characters={props.state.activeGame.characters}
          updateGuiEvent={props.updateGuiEvent}
        />
      </div>
    </div>
  );
}
