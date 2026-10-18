// Builds one ZIP per platform from this folder into dist/.
// Usage: node scripts/pack.mjs [--url https://preview.example/api/mcp]
//   --url  point a test build at another MCP server (preview deploy, tunnel). Release builds omit it and use the prod URL.
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { crc32, deflateRawSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));

/** What each platform's package contains. The Claude directory listing reads the GitHub repo; its ZIP is for "Upload plugin" testing. */
const TARGETS = {
  chatgpt: { files: ["plugin.json", "mcp.json"], dirs: ["skills", "assets"] },
  claude: { files: [".claude-plugin/plugin.json", ".mcp.json", "README.md", "LICENSE"], dirs: ["skills"] },
};
const MCP_CONFIGS = new Set(["mcp.json", ".mcp.json"]);

const urlFlag = process.argv.indexOf("--url");
const urlOverride = urlFlag === -1 ? undefined : process.argv[urlFlag + 1];
if (urlFlag !== -1 && !urlOverride?.startsWith("http")) {
  console.error("--url needs an http(s) URL");
  process.exit(1);
}

const { name, version } = JSON.parse(readFileSync(join(root, "plugin.json"), "utf8"));
mkdirSync(join(root, "dist"), { recursive: true });

for (const [target, { files, dirs }] of Object.entries(TARGETS)) {
  const paths = [...files, ...dirs.flatMap(walk)].sort();
  const entries = paths.map(path => ({ path, data: contents(path) }));
  const out = `dist/${name}-${target}.zip`;
  writeFileSync(join(root, out), zip(entries));
  console.log(`✔ ${out} (${name}@${version}, ${entries.length} files${urlOverride ? `, MCP ${urlOverride}` : ""})`);
}

function contents(path) {
  const data = readFileSync(join(root, path));
  if (!urlOverride || !MCP_CONFIGS.has(path)) return data;
  const config = JSON.parse(data.toString("utf8"));
  for (const server of Object.values(config.mcpServers)) server.url = urlOverride;
  return Buffer.from(`${JSON.stringify(config, null, 2)}\n`);
}

/** Files under `dir`, as forward-slash paths, skipping dotfiles such as .gitkeep. */
function walk(dir) {
  return readdirSync(join(root, dir))
    .filter(entry => !entry.startsWith("."))
    .flatMap(entry => {
      const path = `${dir}/${entry}`;
      return statSync(join(root, path)).isDirectory() ? walk(path) : [path];
    });
}

/** Minimal deflate ZIP writer with fixed timestamps, so the same input always gives the same archive. */
function zip(entries) {
  const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1; // 2026-01-01
  const UTF8_NAMES = 0x0800;
  const local = [];
  const central = [];
  let offset = 0;

  for (const { path, data } of entries) {
    const nameBytes = Buffer.from(path, "utf8");
    const packed = deflateRawSync(data);
    const crc = crc32(data);

    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(UTF8_NAMES, 6);
    header.writeUInt16LE(8, 8); // deflate
    header.writeUInt16LE(0, 10);
    header.writeUInt16LE(DOS_DATE, 12);
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(packed.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(nameBytes.length, 26);
    header.writeUInt16LE(0, 28);
    local.push(header, nameBytes, packed);

    const record = Buffer.alloc(46);
    record.writeUInt32LE(0x02014b50, 0);
    record.writeUInt16LE(20, 4);
    record.writeUInt16LE(20, 6);
    record.writeUInt16LE(UTF8_NAMES, 8);
    record.writeUInt16LE(8, 10);
    record.writeUInt16LE(0, 12);
    record.writeUInt16LE(DOS_DATE, 14);
    record.writeUInt32LE(crc, 16);
    record.writeUInt32LE(packed.length, 20);
    record.writeUInt32LE(data.length, 24);
    record.writeUInt16LE(nameBytes.length, 28);
    record.writeUInt32LE(offset, 42);
    central.push(record, nameBytes);

    offset += header.length + nameBytes.length + packed.length;
  }

  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}
