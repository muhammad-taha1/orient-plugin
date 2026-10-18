// Checks that every platform's manifest describes the same plugin and stays within each directory's limits.
// Usage: node scripts/check.mjs
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const text = path => readFileSync(join(root, path), "utf8");
const json = path => JSON.parse(text(path));
const errors = [];
const fail = message => errors.push(message);

const portable = json("plugin.json"); // ChatGPT + Cursor/Grok Bot
const claude = json(".claude-plugin/plugin.json");
const portableServers = json("mcp.json").mcpServers;
const claudeServers = json(".mcp.json").mcpServers;

// Same identity everywhere.
for (const field of ["name", "version", "description", "license"]) {
  if (portable[field] !== claude[field]) fail(`plugin.json and .claude-plugin/plugin.json disagree on "${field}"`);
}
if (!/^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/.test(portable.name)) fail(`name "${portable.name}" must be lowercase letters, digits and hyphens`);
if (!/^\d+\.\d+\.\d+$/.test(portable.version)) fail(`version "${portable.version}" must be x.y.z`);

// Same MCP server everywhere, over HTTPS, with each platform's transport name.
const serverNames = [...Object.keys(portableServers), ...Object.keys(claudeServers)];
if (new Set(serverNames).size !== 1) fail(`every MCP config must declare the same single server, got: ${serverNames.join(", ")}`);
const servers = [...Object.values(portableServers), ...Object.values(claudeServers)];
const urls = new Set(servers.map(server => server.url));
if (urls.size !== 1) fail(`MCP configs point at different URLs: ${[...urls].join(", ")}`);
for (const url of urls) if (!url?.startsWith("https://")) fail(`MCP URL must be https: ${url}`);
for (const server of Object.values(portableServers)) if (server.type !== "streamable-http") fail(`mcp.json server type must be "streamable-http"`);
for (const server of Object.values(claudeServers)) if (server.type !== "http") fail(`.mcp.json server type must be "http"`);

// OpenAI listing fields (developers.openai.com/plugins/deploy/submission).
const openai = portable.extensions?.["com.openai"] ?? {};
const ui = openai.interface ?? {};
const limits = { displayName: 30, shortDescription: 30, longDescription: 4000, developerName: 80 };
for (const [field, max] of Object.entries(limits)) {
  if (!ui[field]) fail(`plugin.json interface.${field} is required`);
  else if (ui[field].length > max) fail(`interface.${field} is ${ui[field].length} chars, max ${max}`);
}
for (const field of ["category", "logo", "composerIcon", "websiteURL", "privacyPolicyURL", "termsOfServiceURL"]) {
  if (!ui[field]) fail(`plugin.json interface.${field} is required`);
}
for (const field of ["websiteURL", "privacyPolicyURL", "termsOfServiceURL"]) {
  if (ui[field] && !ui[field].startsWith("https://")) fail(`interface.${field} must be https`);
}
for (const asset of [ui.logo, ui.composerIcon, ...(ui.screenshots ?? [])].filter(Boolean)) {
  if (!asset.startsWith("./")) fail(`asset path must start with ./: ${asset}`);
  else if (!existsSync(join(root, asset))) fail(`asset missing: ${asset}`);
}
if (openai.apps) fail("plugin.json must not declare apps (OpenAI rejects app references)");
if (portable.hooks || claude.hooks || existsSync(join(root, "hooks"))) fail("hooks aren't allowed (OpenAI rejects lifecycle hooks)");

// Claude directory: README of at least 40 words outside code blocks.
const readmeWords = text("README.md").replace(/```[\s\S]*?```/g, "").split(/\s+/).filter(Boolean).length;
if (readmeWords < 40) fail(`README.md has ${readmeWords} words, Claude needs at least 40`);

// Skills: each folder has a SKILL.md whose name matches the folder and has a description.
for (const dir of readdirSync(join(root, "skills"))) {
  const path = `skills/${dir}/SKILL.md`;
  if (!existsSync(join(root, path))) { fail(`${path} is missing`); continue; }
  const frontmatter = text(path).match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  if (!new RegExp(`^name: ${dir}$`, "m").test(frontmatter)) fail(`${path} frontmatter name must be "${dir}"`);
  if (!/^description: \S/m.test(frontmatter)) fail(`${path} needs a description`);
}

// No credentials in anything that ships.
for (const path of ["plugin.json", "mcp.json", ".claude-plugin/plugin.json", ".mcp.json"]) {
  if (/clientSecret|client_secret|api[_-]?key|bearer\s|"headers"/i.test(text(path))) fail(`${path} looks like it contains credentials or headers`);
}

// Claude Code's own schema check, when the CLI is installed (not in CI).
const validate = spawnSync("claude plugin validate .", { cwd: root, encoding: "utf8", shell: true });
if (validate.error || validate.status === 127 || /not recognized|not found/i.test(validate.stderr ?? "")) {
  console.log("- skipped `claude plugin validate` (Claude Code not installed)");
} else if (validate.status !== 0) {
  fail(`claude plugin validate failed:\n${validate.stdout}${validate.stderr}`);
} else {
  console.log("✔ claude plugin validate");
}

if (errors.length) {
  console.error(errors.map(e => `✘ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✔ ${portable.name}@${portable.version} manifests agree (${[...urls][0]})`);
