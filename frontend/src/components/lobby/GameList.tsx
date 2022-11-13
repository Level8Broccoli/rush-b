import { h } from "preact";
import { OpenGame } from "../../state/stateTypes";
import { Button } from "../general/Button";

type Props = {
  openGames: OpenGame[];
};

export function GameList(props: Props): JSX.Element {
  if (props.openGames.length === 0) {
    return <em>Keine Spiele gefunden.</em>;
  }

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
                onClick={() => {}}
                size={"sm"}
              />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
