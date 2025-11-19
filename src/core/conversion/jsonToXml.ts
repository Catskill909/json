import { XMLBuilder } from "fast-xml-parser";

const parserOptions = {
  format: true,
  indentBy: "  ",
};

export function jsonToXml(data: unknown): string {
  const builder = new XMLBuilder(parserOptions);
  return builder.build(data ?? {});
}
