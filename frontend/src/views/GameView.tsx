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
    <div className={`card ${classes.customCard}`}>
      <div className="card-content">
        <GameUI
          timer={props.state.activeGame.timer}
          tileMap={props.state.activeGame.level}
          characters={props.state.activeGame.characters}
          updateGuiEvent={props.updateGuiEvent}
        />
        {/*<div style="background-color: lightgray; border-radius: 0.3rem; padding-inline: 1rem;">*/}
        {/*  <Logs*/}
        {/*    connectionStatus={props.state.connectionStatus}*/}
        {/*    logs={props.state.messages}*/}
        {/*  />*/}
        {/*  <Chat updateGuiEvent={props.updateGuiEvent} />*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
