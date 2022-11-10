import { h } from "preact";
import { GameUI } from "../components/canvas/GameUI";
import { Game } from "../state/stateTypes";
import { SendMessage } from "../websocket/websocketTypes";

type Props = {
  game: Game;
  send: SendMessage;
};

export function Game(props: Props): JSX.Element {
  return (
    <>
      <GameUI
        timer={props.game.timer}
        tileMap={props.game.level}
        characters={props.game.characters}
        send={props.send}
      />
    </>
  );
}
