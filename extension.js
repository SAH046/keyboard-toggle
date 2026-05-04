import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class KeyboardToggleExtension extends Extension {
    enable() {
        this._visible = false;

        this._icon = new St.Icon({
            icon_name: 'input-keyboard-symbolic',
            style_class: 'system-status-icon',
        });

        this._button = new St.Button({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true,
            child: this._icon,
        });

        // Store signal ID so we can disconnect it in disable()
        this._signalId = this._button.connect('clicked', () => this._toggle());

        // Insert button at the start of the right side of the top panel
        Main.panel._rightBox.insert_child_at_index(this._button, 0);
    }

    _toggle() {
        const kb = Main.keyboard;
        this._visible = !this._visible;
        if (this._visible) {
            kb.open(global.display.get_primary_monitor());
        } else {
            kb.close(true); // true = animate the hide transition
        }
    }

    disable() {
        // Disconnect signal before destroying button
        if (this._signalId) {
            this._button.disconnect(this._signalId);
            this._signalId = null;
        }

        // Destroying the button also destroys the child icon
        this._button?.destroy();
        this._button = null;
        this._icon?.destroy();
        this._icon = null;
        this._visible = false;
    }
}
