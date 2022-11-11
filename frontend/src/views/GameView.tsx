import { h } from "preact";
import { GameUI } from "../components/canvas/GameUI";
import { AppState } from "../state/stateTypes";
import { SendMessage } from "../websocket/websocketTypes";
import Logs from "../components/log/Logs";
import { Chat } from "../components/chat/Chat";

type Props = {
  state: AppState;
  send: SendMessage;
};

export function GameView(props: Props): JSX.Element {
  return (
    <>
      <GameUI
        timer={props.state.game.timer}
        tileMap={props.state.game.level}
        characters={props.state.game.characters}
        send={props.send}
      />
      <div style="background-color: lightgray; border-radius: 0.3rem; padding-inline: 1rem;">
        <Logs
          connectionStatus={props.state.connectionStatus}
          logs={props.state.messages}
        />
        <Chat send={props.send} />
      </div>
    </>
  );
}
