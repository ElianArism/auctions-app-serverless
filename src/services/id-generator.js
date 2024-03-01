import { v4 as id } from "uuid";

export class IdGenerator {
  static generate() {
    return id();
  }
}
