import { Pure } from "@design-express/fabrica";

export class DefineTable extends Pure {
  static path = "Database/Schema";
  static title = "DefineTable";
  static description = "Create a Table";

  constructor() {
    super();
    this.properties = { name: "", columns: "++id" };

    this.addInput("schema", "dexie::schema");
    this.addInput("name", "string");
    this.addInput("columns", "string");
    this.addOutput("schema", "dexie::schema");

    this.addWidget("text", "name", this.properties.name, "name");
    this.addWidget("text", "columns", this.properties.columns, "columns");

    this.widgets_up = true;
    this.widgets_start_y = 26;
  }

  onExecute() {
    const schema = this.getInputData(1) ?? {};
    const tableName = this.getInputData(2) ?? this.properties.name;
    const columns = this.getInputData(3) ?? this.properties.columns;
    if (schema[tableName]) schema[tableName].add(columns.split(","));
    else schema[tableName] = new Set(columns.split(","));
    this.setOutputData(1, schema);
  }
}
