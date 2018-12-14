import {Injectable} from "@angular/core";
import {IOption} from "ng-select";

@Injectable()
export class SelectOption implements IOption {
  value: string;
  label: string;
  state: string;

  constructor (value, label, state) {
    this.value = value;
    this.state = state;
    this.label = label;
  }
}
