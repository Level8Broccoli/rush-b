import { h } from "preact";
import classes from "./Login.module.css";
import logoUrl from "../../assets/img.png";
import { Button } from "../general/Button";
import { Input } from "../general/Input";
import { StateUpdater, TargetedEvent, useState } from "preact/compat";
import { GuiEvents, UpdateGuiEvent } from "../../state/stateEvents";
import { SendToServer } from "../../api/ClientEventTypes";
import { User, Views } from "../../state/stateTypes";

type Props = {
  updateGuiEvent: UpdateGuiEvent;
  setSend: StateUpdater<SendToServer>;
  user: User;
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

  const login = (e: TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    const isValid = validateName();
    if (isValid) {
      props.updateGuiEvent([
        GuiEvents.StartNewSession,
        [name, props.updateGuiEvent, props.setSend],
      ]);
      props.updateGuiEvent([GuiEvents.GoToView, Views.Lobby]);
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
            <form onSubmit={login}>
              <Input
                label={"Name"}
                placeholder={"Wähle dein Anzeigename"}
                value={name}
                onUpdate={updateName}
                error={isInvalid ? "Bitte einen Namen angeben" : ""}
              />
              <Button label="Anmelden" variant={"black"} type={"submit"} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
