import { h } from "preact";
import { GameUI } from "../components/canvas/GameUI";
import { AppState } from "../state/stateTypes";
import Logs from "../components/log/Logs";
import { Chat } from "../components/chat/Chat";
import { UpdateEvent } from "../state/stateEvents";

type Props = {
  state: AppState;
  updateEvent: UpdateEvent;
};

export function GameView(props: Props): JSX.Element {
  return (
    <>
      <GameUI
        timer={props.state.game.timer}
        tileMap={props.state.game.level}
        characters={props.state.game.characters}
        updateEvent={props.updateEvent}
      />
      <div style="background-color: lightgray; border-radius: 0.3rem; padding-inline: 1rem;">
        <Logs
          connectionStatus={props.state.connectionStatus}
          logs={props.state.messages}
        />
        <Chat updateEvent={props.updateEvent} />
      </div>
    </>
  );
}
