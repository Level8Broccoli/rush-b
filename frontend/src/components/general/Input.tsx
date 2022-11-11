import { h } from "preact";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onUpdate: (v: string) => void;
  error?: string;
};

export function Input(props: Props): JSX.Element {
  return (
    <div class="field">
      <label class="label">{props.label}</label>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder={props.placeholder}
          value={props.value}
          onInput={(e) => props.onUpdate((e.target as HTMLInputElement).value)}
        />
        {props.error && <p class="help is-danger">{props.error}</p>}
      </div>
    </div>
  );
}
