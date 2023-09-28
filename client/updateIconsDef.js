import fs from "fs";

const base =
  "https://github.com/google/material-design-icons/tree/master/symbols/web";

async function main() {
  const r = await fetch(base);
  const d = await r.json();

  const tree = d.payload.tree.items.map((i) => i.name);

  const icons = tree;

  const formattedArray = icons.map((entry) => `\n"${entry}"`).join(" | ");

  const filePath = "./src/interfaces/icons.d.ts";

  fs.writeFile(
    filePath,
    "type Icon = " + formattedArray + "\n\nexport default Icon",
    () => {}
  );
}

main();
