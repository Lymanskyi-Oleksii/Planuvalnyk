import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabaseClient";
import { setCurrentUserId } from "./lib/session";
import { TitleBar } from "./components/TitleBar";
import { AuthScreen } from "./components/AuthScreen";
import { TodaySchedule } from "./components/TodaySchedule";
import { NotesPanel } from "./components/NotesPanel";
import { DailyTasksPanel } from "./components/DailyTasksPanel";
import { WeekSidebar } from "./components/WeekSidebar";
import { AddTaskModal } from "./components/AddTaskModal";
import { useDayData } from "./hooks/useDayData";
import { useWeekSummaries } from "./hooks/useWeekSummaries";
import { addDays, toISODate } from "./lib/date";
import type { ScheduledTask } from "./types";

const TODAY = toISODate(new Date());

export default function App() {
  // undefined = ще перевіряємо сесію, null = не авторизований, Session = увійшли
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserId(data.session?.user.id ?? null);
      setSession(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setCurrentUserId(next?.user.id ?? null);
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas text-sm text-muted">
        Завантаження...
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onAuthenticated={() => {}} />;
  }

  return <PlannerApp />;
}

function PlannerApp() {
  const [activeDate, setActiveDate] = useState(TODAY);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ScheduledTask | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1);

  const {
    scheduledTasks,
    dailyTasks,
    note,
    multiDayNotes,
    toggleScheduledTask,
    toggleSubtask,
    toggleDailyTask,
    editDailyTask,
    addDailyTask,
    deleteDailyTask,
    addScheduledTask,
    updateScheduledTask,
    deleteScheduledTask,
    saveNote,
    addMultiDayNote,
    deleteMultiDayNote,
  } = useDayData(activeDate);

  const weekSummaries = useWeekSummaries(TODAY, refreshKey, 3, 3);

  function openCreateModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEditModal(task: ScheduledTask) {
    setEditingTask(task);
    setModalOpen(true);
  }

  async function handleSaveTask(values: {
    startTime: string;
    endTime: string;
    title: string;
    category: ScheduledTask["category"];
    details?: string;
    subtasks: string[];
  }) {
    if (editingTask) {
      await updateScheduledTask(editingTask.id, values);
    } else {
      await addScheduledTask(values);
    }
    bump();
  }

  async function handleDeleteTask(id: string) {
    await deleteScheduledTask(id);
    bump();
  }

  async function handleToggleTask(id: string, done: boolean) {
    await toggleScheduledTask(id, done);
    bump();
  }

  async function handleToggleSubtask(id: string, done: boolean) {
    await toggleSubtask(id, done);
    bump();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex h-screen flex-col bg-canvas font-sans text-ink">
      <TitleBar onLogout={handleLogout} />

      <main className="flex flex-1 gap-5 overflow-hidden p-5">
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto">
          <TodaySchedule
            date={activeDate}
            tasks={scheduledTasks}
            onPrevDay={() => setActiveDate((d) => addDays(d, -1))}
            onNextDay={() => setActiveDate((d) => addDays(d, 1))}
            onToggleTask={handleToggleTask}
            onToggleSubtask={handleToggleSubtask}
            onAddTask={openCreateModal}
            onEditTask={openEditModal}
            onDeleteTask={handleDeleteTask}
          />

          <div className="grid grid-cols-2 gap-5">
            <NotesPanel
              date={activeDate}
              content={note.content}
              onSave={saveNote}
              multiDayNotes={multiDayNotes}
              onAddMultiDayNote={addMultiDayNote}
              onDeleteMultiDayNote={deleteMultiDayNote}
            />
            <DailyTasksPanel
              tasks={dailyTasks}
              onToggle={toggleDailyTask}
              onAdd={addDailyTask}
              onEdit={editDailyTask}
              onDelete={deleteDailyTask}
            />
          </div>
        </div>

        <WeekSidebar summaries={weekSummaries} activeDate={activeDate} onSelect={setActiveDate} />
      </main>

      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
        existingTasks={scheduledTasks}
      />
    </div>
  );
}
