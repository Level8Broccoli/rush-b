import { h } from "preact";
import { OpenGame } from "../../state/stateTypes";
import { Button } from "../general/Button";
import { UUID } from "../../state/session";
import { GuiEvents, UpdateGuiEvent } from "../../state/stateEvents";

type Props = {
  updateGuiEvent: UpdateGuiEvent;
  openGames: OpenGame[];
};

export function GameList(props: Props): JSX.Element {
  if (props.openGames.length === 0) {
    return <em>Keine Spiele gefunden.</em>;
  }

  const joinOpenGame = (id: UUID) => () => {
    props.updateGuiEvent([GuiEvents.JoinOpenGame, id]);
  };

  return (
    <div class="table-container">
      <table class="table is-fullwidth is-hoverable is-striped is-narrow">
        <tr>
          <th class={"has-text-grey-light"} style={"width: 1%"}>
            ID
          </th>
          <th>Spielername</th>
          <th style={"width: 1%"}></th>
        </tr>
        {props.openGames.map((game) => (
          <tr>
            <td class={"has-text-grey-light"}>{game.id.value.slice(0, 4)}</td>
            <td>{game.creator.name}</td>
            <td>
              <Button
                label={"Beitreten"}
                variant={"ghost"}
                onClick={joinOpenGame(game.id)}
                size={"sm"}
              />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
