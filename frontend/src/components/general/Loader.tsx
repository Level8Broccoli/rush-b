import { h } from "preact";

type Props = {
  label: string;
};

export function Loader(props: Props): JSX.Element {
  return (
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-content">
            <h1 class="has-text-centered mb-3">{props.label}</h1>
            <progress class="progress is-small is-dark" max="100">
              15%
            </progress>
          </div>
        </div>
      </div>
    </div>
  );
}
