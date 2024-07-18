import { Pure } from "@design-express/fabrica";

export class Table extends Pure {
  static path = "Database";
  static title = "Table";
  static description = "Create or Get Table";

  constructor() {
    super();
    this.properties = { name: "" };

    this.addInput("database", "dexie::database");
    this.addInput("name", "string");
    this.addOutput("table", "dexie::table");

    this.addWidget("text", "name", this.properties.name, "name");

    this.widgets_up = true;
    this.widgets_start_y = 26;
  }

  onExecute() {
    const db = this.getInputData(1);
    const tableName = this.getInputData(2) ?? this.properties.name;
    const tbName = `${db.__scope__}/${tableName}`;

    this.setOutputData(1, db[tbName]);
  }
}

export class Insert extends Pure {
  static path = "Database/Query";
  static title = "Insert";
  static description = "Create or Get Table";

  constructor() {
    super();
    this.properties = { data: "" };

    this.addInput("table", "dexie::table");
    this.addInput("data", "");
    this.addOutput("table", "dexie::table");

    //   this.addWidget("text", "data", this.properties.name, "name");
    //   this.addWidget("text", "columns", this.properties.columns, "columns");

    this.widgets_up = true;
    this.widgets_start_y = 26;
  }

  async onExecute() {
    const table = this.getInputData(1);
    const data = { ...(this.getInputData(2) ?? {}) };
    const _data = Object.entries(data);
    for (let i = 0; i < _data.length; i++) {
      if (_data[i][1].isFields && typeof _data[i][1].call === "function") {
        data[_data[i][0]] = _data[i][1].call();
      }
    }
    table.put(data);
    this.setOutputData(1, table);
    // const db = this.getInputData(1);
    // const tableName = this.getInputData(2) ?? this.properties.name;
    // const columns = this.getInputData(3) ?? this.properties.columns;
    // const tbName = `${db.__scope__}/${tableName}`;
    // if (!db[tbName]) {
    //   db.version(db.__version__).stores({ [tbName]: columns });
    // }
    // this.setOutputData(1, db[tbName]);
  }
}
export class get extends Pure {
  static path = "Database/Query";
  static title = "Get";
  static description = "Create or Get Table";

  constructor() {
    super();
    this.properties = { data: "" };

    this.addInput("table", "dexie::table");
    this.addInput("key", "");
    this.addOutput("data", "");

    //   this.addWidget("text", "data", this.properties.name, "name");
    //   this.addWidget("text", "columns", this.properties.columns, "columns");

    this.widgets_up = true;
    this.widgets_start_y = 26;
  }

  async onExecute() {
    const table = this.getInputData(1);
    const indexKey = this.getInputData(2);
    // await table.put(this.getInputData(2)).catch((e) => console.error(e));
    this.setOutputData(1, await table.get(indexKey));
    // const db = this.getInputData(1);
    // const tableName = this.getInputData(2) ?? this.properties.name;
    // const columns = this.getInputData(3) ?? this.properties.columns;
    // const tbName = `${db.__scope__}/${tableName}`;
    // if (!db[tbName]) {
    //   db.version(db.__version__).stores({ [tbName]: columns });
    // }
    // this.setOutputData(1, db[tbName]);
  }
}
export class all extends Pure {
  static path = "Database/Query";
  static title = "All";
  static description = "Create or Get Table";

  constructor() {
    super();

    this.addInput("table|query", "dexie::table,dexie::collection");
    this.addOutput("data", "");

    //   this.addWidget("text", "data", this.properties.name, "name");
    //   this.addWidget("text", "columns", this.properties.columns, "columns");

    this.widgets_up = true;
    this.widgets_start_y = 26;
  }

  async onExecute() {
    const table = this.getInputData(1);
    this.setOutputData(1, await table.toArray());
  }
}

export class count extends Pure {
  static path = "Database/Query";
  static title = "Count";
  static description = "Create or Get Table";

  constructor() {
    super();

    this.addInput("table", "dexie::table");
    this.addOutput("count", "number");
  }

  async onExecute() {
    const table = this.getInputData(1);
    this.setOutputData(1, await table.count());
  }
}

export class exists extends Pure {
  static path = "Database/Query";
  static title = "Exists";
  static description = "Create or Get Table";

  constructor() {
    super();

    this.properties = { fieldName: "", key: "" };
    this.addInput("table", "dexie::table");
    this.addInput("fieldName", "string");
    this.addInput("key", "");

    this.addOutput("exist", "boolean");

    this.addWidget("text", "fieldName", this.properties.fieldName, "fieldName");
    this.addWidget("text", "key", this.properties.key, "key");

    this.widgets_up = true;
    this.widgets_start_y = 26;
  }

  async onExecute() {
    const table = this.getInputData(1);
    const fieldName = this.getInputData(2) ?? this.properties.fieldName;
    const key = this.getInputData(3) ?? this.properties.key;
    this.setOutputData(1, !!(await table.get({ [fieldName]: key })));
  }
}

export class del extends Pure {
  static path = "Database/Query";
  static title = "Delete";
  static description = "Create or Get Table";

  constructor() {
    super();

    this.addInput("query", "dexie::collection");
  }

  async onExecute() {
    const query = this.getInputData(1);
    this.setOutputData(1, await query.delete());
  }
}

export class orderBy extends Pure {
  static path = "Database/Query";
  static title = "OrderBy";
  static description = "Create or Get Table";

  constructor() {
    super();
    this.properties = { fieldName: "" };
    this.addInput("table|query", "dexie::table,dexie::collection");
    this.addInput("fieldName", "string");
    this.addOutput("query", "dexie::collection");
    this.addWidget("text", "fieldName", this.properties.fieldName, "fieldName");

    this.widgets_up = true;
    this.widgets_start_y = 26;
  }

  onExecute() {
    const query = this.getInputData(1);
    const fieldName = this.getInputData(2) ?? this.properties.fieldName;
    this.setOutputData(1, query.orderBy(fieldName));
  }
}

export class limit extends Pure {
  static path = "Database/Query";
  static title = "Limit";
  static description = "Create or Get Table";

  constructor() {
    super();

    this.properties = { count: "" };

    this.addInput("table|query", "dexie::table,dexie::collection");
    this.addInput("count", "number");
    this.addOutput("query", "dexie::collection");

    this.addWidget("text", "count", this.properties.count, "count");

    
    this.widgets_up = true;
    this.widgets_start_y = 26;
  }

  onExecute() {
    const query = this.getInputData(1);
    const count = this.getInputData(2) ?? this.properties.count;
    this.setOutputData(1, query.limit(count));
  }
}

export class update extends Pure {
  static path = "Database/Query";
  static title = "Update";
  static description = "Create or Get Table";

  constructor() {
    super();

    this.properties = { count: "" };

    this.addInput("table", "dexie::table");
    this.addInput("key", "");
    this.addInput("changes", "");
  }

  async onExecute() {
    const table = this.getInputData(1);
    const key = this.getInputData(2);
    const changes = this.getInputData(3);
    const changesEntries = Object.entries(changes);
    changesEntries.forEach((e, i) => {
      if (e[1].isFields && typeof e[1].call === "function") {
        changes[e[0]] = e[1].call();
      }
    });
    await table.update(key, changes);
  }
}
