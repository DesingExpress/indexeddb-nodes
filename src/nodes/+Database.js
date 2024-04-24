import { ImPure } from "@design-express/fabrica";
import Dexie from "dexie";
import { openFile } from "#extension:file";
import { getID, getName, isOrg, getUser } from "#extension:workspace";

export class Database extends ImPure {
  static path = "Database";
  static title = "Database";
  static description = "Create or Get Database";

  constructor() {
    super();
    this.properties = {
      name: "",
      userOnly: false,
      appOnly: false,
      version: "1",
    };
    this.addInput("schema", "dexie::schema", { locked: true });
    this.addInput("", "::donot::", { hidden: true, locked: true });
    this.addInput("name", "string");
    this.addInput("userOnly", "boolean");
    this.addInput("appOnly", "boolean");
    this.addInput("version", "string,number");

    this.addOutput("database", "dexie::database");
    this.addOutput("onMigration", -1);

    this.addWidget("text", "name", this.properties.name, "name");
    this.addWidget("toggle", "userOnly", this.properties.userOnly, "userOnly");
    this.addWidget("toggle", "appOnly", this.properties.appOnly, "appOnly");
    this.addWidget("text", "version", this.properties.version, "version");
    // this.addWidget("button", "getVersion", undefined, () => {});
    this.addWidget("button", "remove", undefined, () => {});

    this.widgets_up = true;
    this.widgets_start_y = 50;
  }

  async onExecute() {
    if (this.__db__?.isOpen()) this.__db__.close();
    const scheme = this.getInputData(1);
    const dbName = this.getInputData(3) ?? this.properties.name;
    const userOnly = this.getInputData(4) ?? this.properties.userOnly;
    const appOnly = this.getInputData(5) ?? this.properties.appOnly;
    const version = this.getInputData(6) ?? this.properties.version;

    const appName = appOnly
      ? window.location.pathname.startsWith("/editor")
        ? await openFile("package.json")
            .then((i) => {
              const { name = "" } = JSON.parse(i);

              return `${getName()}/${name.trim()}`;
            })
            .catch(() => {
              return "";
            })
        : window.location.pathname.startsWith("/app")
        ? (function () {
            const splittedPath = window.location.pathname.split("/");
            return `${splittedPath[2]}/${splittedPath[3]}`;
          })()
        : ""
      : "";

    const db = (this.__db__ = new Dexie(
      userOnly ? `${getUser()}/app` : "global/app"
    ));

    const ver = await db
      .open()
      .then((_db) => _db.verno)
      .catch(() => 0.1)
      .finally(() => db.close());

    await db.version(ver).stores({
      __VER__: "name",
      ...Object.fromEntries(
        Object.entries(scheme).map(([k, v]) => [
          `${appName}/${dbName}/${k}`,
          [...v].join(","),
        ])
      ),
    });

    Object.defineProperty(db, "__scope__", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: `${appName}/${dbName}`,
    });
    await db.open();
    this.setOutputData(1, db);
    if (
      !db.__VER__ ||
      (await db.__VER__.get(`${appName}/${dbName}`))?.version !== version
    ) {
      db.__VER__.put({
        name: `${appName}/${dbName}`,
        version,
      });
      this.triggerSlot(2);
    }
  }
}
