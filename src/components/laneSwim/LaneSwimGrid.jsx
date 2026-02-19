import styles from "./LaneSwimGrid.module.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function minutesToLabel(mins) {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h24 >= 12 ? "pm" : "am";
  const h12 = ((h24 + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

/**
 * Build a list like [360, 390, 420, ...] for each row start time.
 * Defaults: 06:00 -> 22:00, 30-min steps.
 */
function buildSlots({ start = "06:00", end = "22:00", stepMinutes = 30 } = {}) {
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  const slots = [];
  for (let t = startMin; t < endMin; t += stepMinutes) slots.push(t);
  return { slots, startMin, endMin, stepMinutes };
}

function isOpenAtMinute(dayRow, minute) {
  // minute is slot start minute
  return dayRow.windows.some((w) => {
    const s = toMinutes(w.start);
    const e = toMinutes(w.end);
    return minute >= s && minute < e;
  });
}

export default function LaneSwimGrid({
  schedule,
  start = "06:00",
  end = "22:00",
  stepMinutes = 30,
}) {
  const scheduleByDay = new Map(schedule.map((d) => [d.day, d]));
  const { slots } = buildSlots({ start, end, stepMinutes });

  return (
    <div className={styles.wrap}>
      <div className={styles.legend}>
        <span className={styles.keySwim} /> Lane swim
        <span className={styles.keyClosed} /> Not available
      </div>

      <div className={styles.scroller}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.corner}>Time</th>
              {DAYS.map((day) => (
                <th key={day} className={styles.dayHead}>{day}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {slots.map((t) => (
              <tr key={t}>
                <th className={styles.timeCell}>{minutesToLabel(t)}</th>

                {DAYS.map((day) => {
                  const row = scheduleByDay.get(day) ?? { day, windows: [] };
                  const open = isOpenAtMinute(row, t);

                  return (
                    <td
                      key={`${day}-${t}`}
                      className={`${styles.cell} ${open ? styles.open : styles.closed}`}
                      aria-label={`${day} ${minutesToLabel(t)} ${open ? "Lane swim" : "Not available"}`}
                      title={open ? "Lane swim" : "Not available"}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.note}>
        Rows are {stepMinutes}-minute blocks. Pink means lane swim is scheduled during that block.
      </p>
    </div>
  );
}
