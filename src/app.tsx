import * as Gtk from "@gtkx/ffi/gtk";
import {
  GtkApplicationWindow,
  GtkBox,
  GtkButton,
  GtkLabel,
  quit,
} from "@gtkx/react";
import { useState } from "react";
import {
  enableMacMode,
  disableMacMode,
  applyAbnt2,
  setupCedilha,
} from "./systemInterop.ts";

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
          <GtkButton
            label="🍎 Ativar Modo macOS (Ctrl ↔ Command)"
            onClicked={() => handleAction(enableMacMode)}
            cssClasses={["suggested-action", "pill"]}
            sensitive={!isLoading}
          />

          <GtkButton
            label="🔄 Restaurar Padrão (Ctrl e Alt originais)"
            onClicked={() => handleAction(disableMacMode)}
            cssClasses={["pill"]}
            sensitive={!isLoading}
          />

          <GtkButton
            label="⌨️ Definir Layout ABNT2"
            onClicked={() => handleAction(applyAbnt2)}
            cssClasses={["pill"]}
            sensitive={!isLoading}
          />

          <GtkButton
            label="✅ Corrigir Cedilha (´ + c = ç)"
            onClicked={() => handleAction(setupCedilha)}
            cssClasses={["pill"]}
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
