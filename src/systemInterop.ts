import { exec } from "child_process";
import { promisify } from "util";
import { promises as fs } from "fs";
import * as path from "path";
import * as os from "os";

const execAsync = promisify(exec);

const LAYOUT = "us";
const VARIANT = "intl";
const OPTION = "ctrl:swap_lalt_lctl";
const SCHEMAS = [
  { schema: "org.cinnamon.desktop.input-sources", label: "Cinnamon" },
  { schema: "org.gnome.desktop.input-sources", label: "GNOME" },
];

const XCOMPOSE_CONTENT = `include "%L"

# Cedilha com dead_acute (´ + c)
<dead_acute> <C>       : "Ç" Ccedilla  # LATIN CAPITAL LETTER C WITH CEDILLA
<dead_acute> <c>       : "ç" ccedilla  # LATIN SMALL LETTER C WITH CEDILLA
`;

async function runCommand(
  cmd: string,
): Promise<{ stdout: string; stderr: string; success: boolean }> {
  try {
    const { stdout, stderr } = await execAsync(cmd);
    return { stdout, stderr, success: true };
  } catch (error: unknown) {
    const err = error as { stdout?: string; stderr?: string };
    return {
      stdout: err.stdout || "",
      stderr: err.stderr || "",
      success: false,
    };
  }
}

async function schemaAvailable(schema: string): Promise<boolean> {
  const { stdout, success } = await runCommand("gsettings list-schemas");
  return success && stdout.includes(schema);
}

async function setSources(
  schema: string,
  layout: string,
  variant: string,
): Promise<void> {
  const source = variant
    ? `"[('xkb', '${layout}+${variant}')]"`
    : `"[('xkb', '${layout}')]"`;
  await runCommand(`gsettings set ${schema} sources ${source}`);
}

async function setOptions(
  schema: string,
  options: string | null,
): Promise<void> {
  const data = options ? `"['${options}']"` : `"[]"`;
  await runCommand(`gsettings set ${schema} xkb-options ${data}`);
}

async function applySession(
  layout: string,
  variant: string,
  option: string | null = null,
): Promise<void> {
  await runCommand('setxkbmap -option ""');

  let cmd = `setxkbmap -layout ${layout}`;
  if (variant) {
    cmd += ` -variant ${variant}`;
  }
  await runCommand(cmd);

  if (option) {
    await runCommand(`setxkbmap -option ${option}`);
  }
}

async function applyPersistent(
  layout: string,
  variant: string,
  option: string | null = null,
): Promise<string[]> {
  const applied: string[] = [];

  for (const { schema, label } of SCHEMAS) {
    if (!(await schemaAvailable(schema))) {
      continue;
    }
    await setSources(schema, layout, variant);
    await setOptions(schema, option);
    applied.push(label);
  }

  return applied;
}

export async function enableMacMode(): Promise<string> {
  await applySession(LAYOUT, VARIANT, OPTION);
  const persistent = await applyPersistent(LAYOUT, VARIANT, OPTION);

  return `🍎 Ctrl esquerdo trocado com Alt esquerdo. Layout alterado para US Internacional. \nPersistente em: ${
    persistent.join(", ") || "Nenhum"
  }`;
}

export async function disableMacMode(): Promise<string> {
  await applySession(LAYOUT, VARIANT);
  const persistent = await applyPersistent(LAYOUT, VARIANT);

  return `🔄 Troca de Ctrl e Alt desfeita. \nPersistente em: ${
    persistent.join(", ") || "Nenhum"
  }`;
}

export async function applyAbnt2(): Promise<string> {
  await applySession("br", "");
  const persistent = await applyPersistent("br", "");

  return `🔄 Layout ABNT2 aplicado. \nPersistente em: ${
    persistent.join(", ") || "Nenhum"
  }`;
}

export async function setupCedilha(): Promise<string> {
  try {
    const homeDir = os.homedir();
    const xcomposePath = path.join(homeDir, ".XCompose");

    await fs.writeFile(xcomposePath, XCOMPOSE_CONTENT, "utf-8");
    return `✅ Cedilha configurada em: ${xcomposePath}\nReinicie o aplicativo ou faça logout/login para ativar.`;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(`\n❌ Erro ao criar .XCompose: ${err.message}`);
  }
}
