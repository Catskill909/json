import yaml from "js-yaml";

export function jsonToYaml(data: unknown): string {
  return yaml.dump(data, {
    indent: 2,
    lineWidth: 120,
    noCompatMode: true,
    sortKeys: false,
  });
}
