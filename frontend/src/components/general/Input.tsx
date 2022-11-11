import { h } from "preact";

type Props = {
  label: string;
  placeholder?: string;
};

export function Input(props: Props): JSX.Element {
  return (
    <div className="field">
      <label className="label">{props.label}</label>
      <div className="control">
        <input className="input" type="text" placeholder={props.placeholder} />
      </div>
    </div>
  );
}
