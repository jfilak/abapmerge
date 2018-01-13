import File from "./file";

export default class ClassList {
  private deferred: string;
  private exceptions: string;
  private definitions: string;
  private implementations: string;
  private interfaces: string;
  private supers: string[];

  public constructor() {
    this.exceptions = "";
    this.deferred = "";
    this.definitions = "";
    this.implementations = "";
    this.interfaces = "";
    this.supers = [];
  }

  public pushClass(f: File): void {
    let match = f.getContents().match(/^(([\s\S])*ENDCLASS\.)\s*(CLASS(.|\s)*)$/i);
    if (!match || !match[1] || !match[2] || !match[3]) {
      throw "error parsing class: " + f.getFilename();
    }
    let name = f.getFilename().split(".")[0];
    let def = this.removePublic(name, match[1]);

    let superMatch = def.match(/INHERITING FROM (\w+)/i);
    if (superMatch && superMatch[1]) {
      this.supers.push(superMatch[1]);
    }

    if (name.match(/^.?CX_/i)) {
// the DEFINITION DEFERRED does not work very well for exception classes
      this.exceptions = this.exceptions + def + "\n" + match[3] + "\n";
    } else {
      this.deferred = this.deferred + "CLASS " + name + " DEFINITION DEFERRED.\n";
      if (this.supers.indexOf(name) >= 0) {
// this is just a quick workaround, TODO
        this.definitions = def + this.definitions + "\n";
      } else {
        this.definitions = this.definitions + def + "\n";
      }
      this.implementations = this.implementations + match[3] + "\n";
    }
  }

  public pushInterface(f: File): void {
    let match = f.getContents().match(/^([\s\S]+) PUBLIC([\s\S]+)$/i);
    if (!match || !match[1] || !match[2]) {
      throw "error parsing interface: " + f.getFilename();
    }
    this.interfaces = this.interfaces + match[1] + match[2];
  }

  public getResult(): string {
    return this.exceptions +
      this.deferred +
      this.interfaces +
      this.definitions +
      this.implementations;
  }

  public getDeferred(): string {
    return this.deferred;
  }

  public getDefinitions(): string {
    return this.definitions;
  }

  public getExceptions(): string {
    return this.exceptions;
  }

  public getImplementations(): string {
    return this.implementations;
  }

  public getInterfaces(): string {
    return this.interfaces;
  }

  private removePublic(name: string, s: string): string {
    let reg = new RegExp("CLASS\\s+" + name + "\\s+DEFINITION\\s+PUBLIC", "i");
    return s.replace(reg, "CLASS " + name + " DEFINITION");
  }
}