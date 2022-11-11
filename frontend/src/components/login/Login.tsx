import { h } from "preact";
import classes from "./Login.module.css";
import logoUrl from "../../assets/img.png";
import { Button } from "../general/Button";
import { Input } from "../general/Input";
import { useState } from "preact/compat";
import { Events, UpdateEvent } from "../../state/stateEvents";

type Props = {
  updateEvent: UpdateEvent;
};

export function Login(props: Props): JSX.Element {
  const [name, setName] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const updateName = (v: string) => {
    setIsInvalid(false);
    setName(v);
  };

  const validateName = (): boolean => {
    if (name.trim().length > 0) {
      return true;
    }
    setIsInvalid(true);
    return false;
  };

  const startNewGame = () => {
    const isValid = validateName();
    if (isValid) {
      props.updateEvent([Events.StartNewGame, name]);
    }
  };

  const goToLobby = () => {
    const isValid = validateName();
    if (isValid) {
      props.updateEvent([Events.SearchForGame, name]);
    }
  };

  return (
    <div class="card">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class={`image ${classes.logo}`}>
              <img src={logoUrl} alt="rush-b Logo" />
            </figure>
          </div>
          <div class="media-content">
            <h2 class="title is-4">Jetzt Spielen!</h2>
            <Input
              label={"Name"}
              placeholder={"Wähle dein Anzeigename"}
              value={name}
              onUpdate={updateName}
              error={isInvalid ? "Bitte einen Namen angeben" : ""}
            />
            <div class={`mt-6 buttons ${classes.buttonGroup}`}>
              <Button
                label="Neues Spiel starten"
                variant={"black"}
                onClick={startNewGame}
              />
              <Button
                label="Spiel suchen"
                variant={"light"}
                onClick={goToLobby}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
