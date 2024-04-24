import { Pure } from "@design-express/fabrica";

export class nowDate extends Pure {
  static path = "Database/Fields";
  static title = "DateTime";
  static description = "Create or Get Table";

  constructor() {
    super({ mode: 0 });

    this.properties = { now: true };
    this.addOutput("field", "dexie::field,object");

    this.addWidget("toggle", "now", this.properties.now, "now").disabled = true;
  }
  changeMode() {
    return 0;
  }

  onExecute() {
    const field = { isFields: true, call: () => Date.now() };
    Object.seal(field);
    Object.freeze(field);
    this.setOutputData(1, field);
  }
}
