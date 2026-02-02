import { useEffect } from "react";

// ── Vite imports — resolve đúng path build time ──
import defaultCursor from "../assets/images/cursors/Asahina_Mafuyu.png";
import linkCursor from "../assets/images/cursors/Mafuyu_Link.png";
import textCursor from "../assets/images/cursors/Mafuyu_Text.png";
import busyCursor from "../assets/images/cursors/Mafuyu_Busy.png";
import workingCursor from "../assets/images/cursors/Mafuyu_Working.png";
import helpCursor from "../assets/images/cursors/Mafuyu_Help.png";
import unavailableCursor from "../assets/images/cursors/Mafuyu_Unavailable.png";
import moveCursor from "../assets/images/cursors/Mafuyu_Move.png";
import horizontalCursor from "../assets/images/cursors/Mafuyu_Horizontal.png";
import verticalCursor from "../assets/images/cursors/Mafuyu_Vertical.png";
import diagonal1Cursor from "../assets/images/cursors/Mafuyu_Diagonal_1.png";
import diagonal2Cursor from "../assets/images/cursors/Mafuyu_Diagonal_2.png";
import precisionCursor from "../assets/images/cursors/Mafuyu_Precision.png";
import alternateCursor from "../assets/images/cursors/Mafuyu_Alternate.png";
import locationCursor from "../assets/images/cursors/Mafuyu_Location.png";
import personCursor from "../assets/images/cursors/Mafuyu_Person.png";
import handwritingCursor from "../assets/images/cursors/Mafuyu_Handwriting.png";

export function useGlobalCursors() {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "mafuyu-cursors";
    style.textContent = `
      *, *::before, *::after {
        cursor: url('${defaultCursor}') 10 0, auto !important;
      }
      a, button, select, summary,
      [role="button"], [role="tab"],
      [role="menuitem"], [role="option"],
      .clickable {
        cursor: url('${linkCursor}') 10 0, pointer !important;
      }
      input:not([type="range"]):not([type="checkbox"]):not([type="radio"]),
      textarea, [contenteditable="true"] {
        cursor: url('${textCursor}') 10 0, text !important;
      }
      .loading, [aria-busy="true"] {
        cursor: url('${busyCursor}') 10 0, wait !important;
      }
      .working {
        cursor: url('${workingCursor}') 10 0, progress !important;
      }
      abbr, .help-icon {
        cursor: url('${helpCursor}') 10 0, help !important;
      }
      :disabled, [disabled], [aria-disabled="true"], .disabled {
        cursor: url('${unavailableCursor}') 10 0, not-allowed !important;
      }
      .draggable, [draggable="true"] {
        cursor: url('${moveCursor}') 10 0, grab !important;
      }
      .dragging {
        cursor: url('${moveCursor}') 10 0, grabbing !important;
      }
      .resize-h { cursor: url('${horizontalCursor}') 16 16, ew-resize !important; }
      .resize-v { cursor: url('${verticalCursor}') 16 16, ns-resize !important; }
      .resize-d1 { cursor: url('${diagonal1Cursor}') 16 16, nwse-resize !important; }
      .resize-d2 { cursor: url('${diagonal2Cursor}') 16 16, nesw-resize !important; }
      .crosshair { cursor: url('${precisionCursor}') 16 16, crosshair !important; }
      .context-menu { cursor: url('${alternateCursor}') 10 0, context-menu !important; }
      .location { cursor: url('${locationCursor}') 10 24, pointer !important; }
      .person { cursor: url('${personCursor}') 10 0, pointer !important; }
      .handwriting { cursor: url('${handwritingCursor}') 10 0, text !important; }
    `;

    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);
}