import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerPopupProps {
  value: string; // "HH:MM" 24h
  onChange: (value: string) => void;
  className?: string;
}

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export function TimePickerPopup({ value, onChange, className }: TimePickerPopupProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const parts = (value || "09:00").split(":");
  const h24 = parseInt(parts[0]) || 0;
  const m = parseInt(parts[1]) || 0;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;

  const display = `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;

  useEffect(() => {
    function down(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", down);
    return () => document.removeEventListener("mousedown", down);
  }, []);

  function emit(newH24: number, newM: number) {
    onChange(`${String(newH24).padStart(2, "0")}:${String(newM).padStart(2, "0")}`);
  }

  function setHour(h: number) {
    let newH24 = h % 12;
    if (ampm === "PM") newH24 += 12;
    emit(newH24, m);
  }

  function setMinute(min: number) {
    emit(h24, min);
  }

  function setAmPm(ap: "AM" | "PM") {
    if (ap === ampm) return;
    emit(ap === "PM" ? h24 + 12 : h24 - 12, m);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background hover:bg-accent/50 transition-colors w-full text-sm"
      >
        <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <span className="tabular-nums text-foreground">{display}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border rounded-xl shadow-lg p-3 w-52">
          <div className="flex gap-0">
            {/* Hours */}
            <div className="flex-1 pr-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 text-center">Hour</p>
              <div className="grid grid-cols-3 gap-1">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHour(h)}
                    className={cn(
                      "py-1 rounded-md text-xs font-medium transition-colors",
                      h === h12
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-foreground"
                    )}
                  >
                    {String(h).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-border self-stretch mx-1" />

            {/* Minutes */}
            <div className="flex-1 pl-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 text-center">Min</p>
              <div className="grid grid-cols-3 gap-1">
                {MINUTES.map((min) => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => setMinute(min)}
                    className={cn(
                      "py-1 rounded-md text-xs font-medium transition-colors",
                      min === m
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-foreground"
                    )}
                  >
                    {String(min).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AM / PM */}
          <div className="mt-2 flex rounded-md border border-input overflow-hidden">
            {(["AM", "PM"] as const).map((ap) => (
              <button
                key={ap}
                type="button"
                onClick={() => setAmPm(ap)}
                className={cn(
                  "flex-1 py-1 text-xs font-semibold transition-colors",
                  ampm === ap
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-muted-foreground"
                )}
              >
                {ap}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
