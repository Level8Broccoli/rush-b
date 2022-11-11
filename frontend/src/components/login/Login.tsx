import { h } from "preact";
import classes from "./Login.module.css";
import logoUrl from "../../assets/img.png";
import { Button } from "../general/Button";
import { Input } from "../general/Input";

export function Login(): JSX.Element {
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
            <Input label={"Name"} placeholder={"Wähle dein Anzeigename"} />
            <div className={`mt-6 buttons ${classes.buttonGroup}`}>
              <Button label="Neues Spiel starten" variant={"black"} />
              <Button label="Spiel beitreten" variant={"light"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
