import * as Gtk from "@gtkx/ffi/gtk";
import {
  GtkApplicationWindow,
  GtkBox,
  GtkLabel,
  quit,
} from "@gtkx/react";
import { useState } from "react";
import {
  enableMacMode,
  disableMacMode,
  applyAbnt2,
  setupCedilha,
  setupCmdQ,
  removeCmdQ,
} from "./systemInterop.ts";
import { IconButton } from "./IconButton.tsx";

export const App = () => {
  const [status, setStatus] = useState("Selecione uma ação para começar");
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: () => Promise<string>) => {
    setIsLoading(true);
    try {
      const message = await action();
      setStatus(message);
    } catch (error: unknown) {
      const err = error as Error;
      setStatus(`Erro: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GtkApplicationWindow
      title="MacKeys Configurator"
      defaultWidth={500}
      defaultHeight={450}
      onClose={quit}
    >
      <GtkBox
        orientation={Gtk.Orientation.VERTICAL}
        spacing={12}
        marginTop={24}
        marginBottom={24}
        marginStart={24}
        marginEnd={24}
      >
        <GtkBox
          orientation={Gtk.Orientation.VERTICAL}
          spacing={4}
          marginBottom={16}
        >
          <GtkLabel label="MacKeys Configurator" cssClasses={["title-1"]} />
          <GtkLabel
            label="Configure seu teclado estilo Apple no Linux"
            cssClasses={["dim-label", "body"]}
          />
        </GtkBox>

        <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={10}>
          <IconButton
            iconName="input-keyboard-symbolic"
            label="Ativar Modo macOS (Ctrl ↔ Command)"
            onClick={() => handleAction(enableMacMode)}
            cssClasses={["suggested-action", "pill"]}
            sensitive={!isLoading}
          />

          <IconButton
            iconName="edit-undo-symbolic"
            label="Restaurar Padrão (Ctrl e Alt originais)"
            onClick={() => handleAction(disableMacMode)}
            sensitive={!isLoading}
          />

          <IconButton
            iconName="preferences-desktop-keyboard-symbolic"
            label="Definir Layout ABNT2"
            onClick={() => handleAction(applyAbnt2)}
            sensitive={!isLoading}
          />

          <IconButton
            iconName="tools-check-spelling-symbolic"
            label="Corrigir Cedilha (´ + c = ç)"
            onClick={() => handleAction(setupCedilha)}
            sensitive={!isLoading}
          />

          <IconButton
            iconName="preferences-desktop-keyboard-shortcuts-symbolic"
            label="Ativar Cmd+Q para fechar janelas"
            onClick={() => handleAction(setupCmdQ)}
            sensitive={!isLoading}
          />

          <IconButton
            iconName="edit-clear-symbolic"
            label="Remover Cmd+Q"
            onClick={() => handleAction(removeCmdQ)}
            sensitive={!isLoading}
          />
        </GtkBox>

        <GtkBox
          orientation={Gtk.Orientation.VERTICAL}
          spacing={8}
          cssClasses={["card"]}
          marginTop={20}
        >
          <GtkLabel
            label="Status:"
            halign={Gtk.Align.START}
            cssClasses={["caption", "bold"]}
            marginStart={16}
            marginEnd={16}
            marginTop={12}
          />
          <GtkLabel
            label={status}
            wrap
            halign={Gtk.Align.START}
            cssClasses={["body"]}
            marginStart={16}
            marginEnd={16}
            marginBottom={12}
          />
        </GtkBox>

        <GtkLabel
          label="github.com/carlosxfelipe/mackeys-configurator"
          cssClasses={["dim-label", "caption"]}
          marginTop={16}
          halign={Gtk.Align.CENTER}
        />
      </GtkBox>
    </GtkApplicationWindow>
  );
};

export default App;
