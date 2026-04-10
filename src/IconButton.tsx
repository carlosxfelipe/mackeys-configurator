import * as Gtk from "@gtkx/ffi/gtk";
import { GtkBox, GtkButton, GtkImage, GtkLabel } from "@gtkx/react";

type IconButtonProps = {
  iconName: string;
  label: string;
  onClick: () => void;
  cssClasses?: string[];
  sensitive?: boolean;
};

export const IconButton = ({
  iconName,
  label,
  onClick,
  cssClasses = ["pill"],
  sensitive = true,
}: IconButtonProps) => (
  <GtkButton onClicked={onClick} cssClasses={cssClasses} sensitive={sensitive}>
    <GtkBox
      orientation={Gtk.Orientation.HORIZONTAL}
      spacing={8}
      halign={Gtk.Align.CENTER}
    >
      <GtkImage iconName={iconName} iconSize={Gtk.IconSize.NORMAL} />
      <GtkLabel label={label} />
    </GtkBox>
  </GtkButton>
);
