import { useState } from "react";
import { Checkbox } from "./Checkbox";
import { CategoryBadge } from "./CategoryBadge";
import type { ScheduledTask } from "@/types";

const RAIL_COLORS: Record<string, string> = {
  study: "bg-category-study-fg",
  university: "bg-category-university-fg",
  work: "bg-category-work-fg",
  sport: "bg-category-sport-fg",
  food: "bg-category-food-fg",
  health: "bg-category-health-fg",
  personal: "bg-category-personal-fg",
  errands: "bg-category-errands-fg",
  other: "bg-category-other-fg",
};

const ROW_TINTS: Record<string, string> = {
  study: "bg-category-study-bg/60",
  university: "bg-category-university-bg/60",
  work: "bg-category-work-bg/60",
  sport: "bg-category-sport-bg/60",
  food: "bg-category-food-bg/60",
  health: "bg-category-health-bg/60",
  personal: "bg-category-personal-bg/60",
  errands: "bg-category-errands-bg/60",
  other: "bg-category-other-bg/60",
};

interface ScheduleRowProps {
  task: ScheduledTask;
  onToggleTask: (id: string, done: boolean) => void;
  onToggleSubtask: (id: string, done: boolean) => void;
  onEdit: (task: ScheduledTask) => void;
  onDelete: (id: string) => void;
}

export function ScheduleRow({ task, onToggleTask, onToggleSubtask, onEdit, onDelete }: ScheduleRowProps) {
  const [expanded, setExpanded] = useState(true);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const hasSubtasks = task.subtasks.length > 0;

  return (
    <div
      className={`group grid grid-cols-[66px_140px_1fr_1.4fr_72px] border-b border-line ${
        task.done ? "bg-canvas/70" : ROW_TINTS[task.category]
      }`}
    >
      <div className="flex items-center justify-center px-3 py-4">
        <Checkbox checked={task.done} onChange={(v) => onToggleTask(task.id, v)} />
      </div>

      <div className="relative flex items-center py-4 pl-4 pr-3 text-sm text-ink">
        <span className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full ${RAIL_COLORS[task.category]}`} />
        {task.startTime}–{task.endTime}
      </div>

      <div className="flex flex-col justify-center gap-1.5 py-4 pr-4">
        <span className={`text-sm font-semibold ${task.done ? "text-muted line-through" : "text-ink"}`}>
          {task.title}
        </span>
        <CategoryBadge category={task.category} />
      </div>

      <div className="py-4 pr-6">
        {hasSubtasks ? (
          <>
            <button
              onClick={() => setExpanded((e) => !e)}
              className="mb-1 flex w-full items-center justify-end text-muted"
              aria-label={expanded ? "Згорнути підзадачі" : "Розгорнути підзадачі"}
            >
              <svg
                viewBox="0 0 16 16"
                className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                fill="none"
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {expanded && (
              <ul className="space-y-2">
                {task.subtasks.map((s) => (
                  <li key={s.id} className="flex items-center gap-2.5">
                    <Checkbox size="sm" checked={s.done} onChange={(v) => onToggleSubtask(s.id, v)} />
                    <span className={`text-sm ${s.done ? "text-muted line-through" : "text-ink/90"}`}>
                      {s.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : task.details ? (
          <p className="text-sm text-muted">{task.details}</p>
        ) : null}
      </div>

      <div className="flex items-start justify-end gap-1 py-4 pr-3 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(task)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
          aria-label="Редагувати задачу"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
            <path d="M11 2l3 3-8 8H3v-3l8-8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => (confirmingDelete ? onDelete(task.id) : setConfirmingDelete(true))}
          onBlur={() => setConfirmingDelete(false)}
          className={`flex h-7 items-center justify-center rounded-lg px-2 text-xs font-medium transition-colors ${
            confirmingDelete
              ? "bg-red-50 text-red-600"
              : "w-7 text-muted hover:bg-canvas hover:text-red-600"
          }`}
          aria-label="Видалити задачу"
        >
          {confirmingDelete ? (
            "Так?"
          ) : (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path d="M3 5h10M6.5 5V3.5h3V5M5 5v8.5h6V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
