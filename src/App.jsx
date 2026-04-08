import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// SHARED DATA
// ─────────────────────────────────────────────

const UPPER_EXERCISES = [
  { id: "u1", name: "Incline Chest Press",   sets: "3", reps: "10–12", rest: "90s" },
  { id: "u2", name: "Pec Deck Fly",          sets: "2", reps: "12–15", rest: "60s" },
  { id: "u3", name: "Lat Pulldown",          sets: "4", reps: "10–12", rest: "90s" },
  { id: "u4", name: "Rear Delt Fly",         sets: "2", reps: "12–15", rest: "60s" },
  { id: "u5", name: "Shoulder Press",        sets: "3", reps: "10",    rest: "75s" },
  { id: "u6", name: "Lateral Raises",        sets: "2", reps: "12–15", rest: "60s" },
  { id: "u7", name: "Dumbbell Curls",        sets: "3", reps: "12",    rest: "60s" },
];

const LOWER_EXERCISES = [
  { id: "l1", name: "Leg Press",             sets: "3", reps: "10",     rest: "90s" },
  { id: "l2", name: "Lunges",                sets: "2", reps: "10/leg", rest: "75s" },
  { id: "l3", name: "Leg Curl",              sets: "3", reps: "12",     rest: "75s" },
  { id: "l4", name: "Leg Extension",         sets: "2", reps: "12",     rest: "60s" },
  { id: "l5", name: "Calf Raises",           sets: "3", reps: "15",     rest: "60s" },
  { id: "l6", name: "Plank",                 sets: "2", reps: "30-45s", rest: "60s" },
  { id: "l7", name: "Back Extension",        sets: "2", reps: "12-15",  rest: "60s" },
  { id: "l8", name: "Glute Bridges",         sets: "2", reps: "15",     rest: "60s", optional: true },
];

const DIET_MEALS = [
  { id: "m1", time: "8:30 AM",  icon: "🥣", name: "Breakfast",      desc: "Mess food (roti/paratha + sabzi + dal + curd) + fruit + peanut butter sandwich + Zincovit" },
  { id: "m2", time: "11:30 AM", icon: "🥜", name: "Mid-Morning",    desc: "Banana + peanuts/chana (any 1-2 if busy)" },
  { id: "m3", time: "1:00 PM",  icon: "🍛", name: "Lunch",          desc: "Roti + sabzi + double dal + curd" },
  { id: "m4", time: "5:00 PM",  icon: "🌰", name: "Evening Snack",  desc: "Roasted soya (30g) OR peanuts/chana" },
  { id: "m5", time: "6:30 PM",  icon: "⚡", name: "Pre-Workout",    desc: "Oats (60-80g) + banana + PB sandwich" },
  { id: "m6", time: "8:30 PM",  icon: "🍽️", name: "Dinner",        desc: "Roti + sabzi + double dal + curd - eat maximum" },
  { id: "m7", time: "11:30 PM", icon: "🌙", name: "Night Snack",    desc: "Peanuts (30g) OR roasted soya OR peanut butter + Keraglo Eva" },
];

const SUPPLEMENTS_LIST = [
  { id: "s1", name: "Zincovit",    timing: "After breakfast, daily",       icon: "🟡", color: "text-yellow-400", border: "border-yellow-800", bg: "bg-yellow-950/30" },
  { id: "s3", name: "Keraglo Eva", timing: "Night, with dinner or after",  icon: "🟣", color: "text-purple-400", border: "border-purple-800", bg: "bg-purple-950/30" },
  { id: "s4", name: "Vitamin E",   timing: "Alternate days with food",     icon: "🟢", color: "text-green-400",  border: "border-green-800",  bg: "bg-green-950/30"  },
  { id: "s5", name: "Creatine",    timing: "Post-workout, start Month 3+", icon: "⚪", color: "text-slate-300",  border: "border-slate-700",  bg: "bg-slate-900/30"  },
];

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────

function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

function useLS(key, def) {
  const [val, setVal] = useState(function() {
    try { var s = localStorage.getItem(key); return s !== null ? JSON.parse(s) : def; }
    catch(e) { return def; }
  });
  useEffect(function() { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} }, [key, val]);
  return [val, setVal];
}

function getTodayType() {
  var d = new Date().getDay();
  if (d === 1 || d === 3) return "upper";
  if (d === 2 || d === 4) return "lower";
  if (d === 6) return "light";
  return "rest";
}

function getDayName() {
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
}

// Returns days since a date string, or null
function daysSince(dateStr) {
  if (!dateStr) return null;
  var then = new Date(dateStr);
  var now  = new Date();
  then.setHours(0,0,0,0);
  now.setHours(0,0,0,0);
  return Math.floor((now - then) / 86400000);
}

// Workout status labels + styles
var WO_STATUS = {
  done:    { label: "Completed",           emoji: "✅", color: "text-green-400",  bg: "bg-green-950/40",  border: "border-green-800/60"  },
  skipped: { label: "Skipped (low energy)", emoji: "😌", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-800/40" },
  rest:    { label: "Rest Day",             emoji: "💤", color: "text-slate-400",  bg: "bg-slate-900/30",  border: "border-slate-700/40"  },
};

// ─────────────────────────────────────────────
// SHARED UI
// ─────────────────────────────────────────────

function Card({ children, className }) {
  return (
    <div className={"bg-[#1a1b1e] border border-[#2a2c30] rounded-2xl p-4 " + (className || "")}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-base font-bold text-white mb-3 mt-4">{children}</h2>;
}

function Toggle({ checked, onChange, label, sublabel, icon }) {
  return (
    <button
      onClick={onChange}
      className={"w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left " + (checked ? "bg-green-950/40 border-green-800/60" : "bg-[#0e0f11] border-[#2a2c30]")}
    >
      {icon && <span className="text-xl flex-shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className={"text-[13px] font-medium " + (checked ? "text-green-300 line-through" : "text-white")}>{label}</div>
        {sublabel && <div className="text-[11px] text-[#6b6f78] mt-0.5">{sublabel}</div>}
      </div>
      <div className={"w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all " + (checked ? "bg-green-500 border-green-500" : "border-[#4a4d55]")}>
        {checked && <span className="text-black text-[10px] font-black">✓</span>}
      </div>
    </button>
  );
}

function ProgressBar({ value, max, color }) {
  var pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full bg-[#0e0f11] rounded-full h-2 border border-[#2a2c30]">
      <div className={(color || "bg-green-500") + " h-2 rounded-full transition-all duration-500"} style={{width: pct + "%"}} />
    </div>
  );
}

// ─────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────

function HomeScreen({ onNavigate }) {
  var todayType = getTodayType();
  var today     = todayKey();

  var clResult   = useLS("daily_checklist", { date: "", checks: {} });
  var cl         = clResult[0];
  var checks     = cl.date === today ? cl.checks : {};
  var clDone     = Object.values(checks).filter(Boolean).length;

  var streakResult = useLS("streak_data", { count: 0, lastDate: "" });
  var streak       = streakResult[0];

  var whResult       = useLS("weight_history", []);
  var weightHistory  = whResult[0];
  var latestEntry    = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1] : null;
  var daysSinceW     = latestEntry ? daysSince(latestEntry.date) : null;
  var needsWeightUpd = daysSinceW === null || daysSinceW >= 30;

  var gymResult    = useLS("gym_checks_" + today, {});
  var gymChecks    = gymResult[0];
  var allExercises = todayType === "upper" ? UPPER_EXERCISES : todayType === "lower" ? LOWER_EXERCISES : [];
  var gymDoneCount = allExercises.filter(function(e) { return gymChecks[e.id] === "done"; }).length;

  var woLogResult  = useLS("workout_log", {});
  var workoutLog   = woLogResult[0];
  var todayWoStat  = workoutLog[today];

  var todayWoStat = workoutLog[today];
  var missedToday = !todayWoStat && todayType !== "rest";

  var suppResult   = useLS("supp_checks_" + today, {});
  var suppChecks   = suppResult[0];
  var suppDone     = SUPPLEMENTS_LIST.filter(function(s) { return suppChecks[s.id]; }).length;

  var workoutLabel = { upper: "Upper Body Day", lower: "Lower Body Day", light: "Light / Active Rest", rest: "Rest Day 😴" }[todayType];
  var workoutColor = todayType === "rest" ? "text-[#6b6f78]" : "text-green-400";
  var timeStr      = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-3">
      {missedToday && (
        <Card className="border-pink-800/40 bg-pink-950/20">
          <div className="text-[12px] font-bold text-pink-400">
            💛 Didn’t go today? That’s okay — try again tomorrow
          </div>
        </Card>
      )}
      <Card className="bg-gradient-to-br from-[#0f2318] to-[#0e0f11] border-green-900/40">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] text-green-500 uppercase tracking-widest mb-0.5">{timeStr} · {getDayName()}</div>
            <h1 className="text-2xl font-black text-white">Good day, Priyal!</h1>
            <div className={"text-[13px] font-semibold mt-1 " + workoutColor}>🏋️ {workoutLabel}</div>
          </div>
          {streak.count > 0 && (
            <div className="bg-[#2a1a05] border border-orange-800/50 text-orange-400 text-[11px] font-bold px-2.5 py-1.5 rounded-full flex-shrink-0">
              🔥 {streak.count}d
            </div>
          )}
        </div>
        {todayWoStat && WO_STATUS[todayWoStat] && (
          <div className={"mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold " + WO_STATUS[todayWoStat].bg + " " + WO_STATUS[todayWoStat].border + " " + WO_STATUS[todayWoStat].color}>
            {WO_STATUS[todayWoStat].emoji} {WO_STATUS[todayWoStat].label}
          </div>
        )}
        {todayType !== "rest" && !todayWoStat && (
          <button onClick={function() { onNavigate("gym"); }} className="mt-3 w-full bg-green-500 text-black font-bold py-2.5 rounded-xl text-[13px]">
            Go to Workout →
          </button>
        )}
      </Card>

      {/* Weight reminder */}
      {needsWeightUpd ? (
        <button onClick={function() { onNavigate("progress"); }} className="w-full text-left">
          <Card className="border-yellow-800/50 bg-yellow-950/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] font-bold text-yellow-400">⚠️ Time to update your weight</div>
                <div className="text-[11px] text-[#8a8f99] mt-0.5">
                  {daysSinceW === null ? "No weight logged yet — tap to add" : "Last logged " + daysSinceW + " days ago"}
                </div>
              </div>
              <span className="text-yellow-600 text-lg">→</span>
            </div>
          </Card>
        </button>
      ) : (
        <button onClick={function() { onNavigate("progress"); }} className="w-full text-left">
          <Card className="border-green-900/40">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] font-bold text-green-400">⚖️ Weight up to date</div>
                <div className="text-[11px] text-[#8a8f99] mt-0.5">
                  {latestEntry.weight} kg · logged {daysSinceW === 0 ? "today" : daysSinceW + "d ago"}
                </div>
              </div>
              <span className="text-green-700 text-lg">→</span>
            </div>
          </Card>
        </button>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button onClick={function() { onNavigate("gym"); }} className="text-left">
          <Card>
            <div className="text-[10px] text-[#6b6f78] uppercase tracking-wider mb-1">Today Gym</div>
            <div className="text-xl font-black text-green-400">{gymDoneCount}/{allExercises.length}</div>
            <div className="text-[11px] text-[#8a8f99] mt-1">exercises done</div>
            <ProgressBar value={gymDoneCount} max={allExercises.length} />
          </Card>
        </button>
        <button onClick={function() { onNavigate("diet"); }} className="text-left">
          <Card>
            <div className="text-[10px] text-[#6b6f78] uppercase tracking-wider mb-1">Today Diet</div>
            <div className="text-xl font-black text-blue-400">{clDone}/3</div>
            <div className="text-[11px] text-[#8a8f99] mt-1">checklist items</div>
            <ProgressBar value={clDone} max={3} color="bg-blue-500" />
          </Card>
        </button>
        <button onClick={function() { onNavigate("supplements"); }} className="text-left">
          <Card>
            <div className="text-[10px] text-[#6b6f78] uppercase tracking-wider mb-1">Supplements</div>
            <div className="text-xl font-black text-yellow-400">{suppDone}/{SUPPLEMENTS_LIST.length}</div>
            <div className="text-[11px] text-[#8a8f99] mt-1">taken today</div>
            <ProgressBar value={suppDone} max={SUPPLEMENTS_LIST.length} color="bg-yellow-500" />
          </Card>
        </button>
        <button onClick={function() { onNavigate("progress"); }} className="text-left">
          <Card>
            <div className="text-[10px] text-[#6b6f78] uppercase tracking-wider mb-1">Weight</div>
            <div className="text-xl font-black text-purple-400">{latestEntry ? latestEntry.weight + "kg" : "—"}</div>
            <div className="text-[11px] text-[#8a8f99] mt-1">{latestEntry ? latestEntry.date : "not logged"}</div>
          </Card>
        </button>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-white">🍱 Today Meals</span>
          <button onClick={function() { onNavigate("diet"); }} className="text-[11px] text-green-400">See all →</button>
        </div>
        <div className="space-y-1">
          {DIET_MEALS.slice(0, 4).map(function(m) { return (
            <div key={m.id} className="flex items-center gap-2 py-1.5 border-b border-[#2a2c30] last:border-0">
              <span className="text-base">{m.icon}</span>
              <div className="flex-1">
                <span className="text-[12px] font-medium text-white">{m.name}</span>
                <span className="text-[11px] text-[#6b6f78] ml-2">{m.time}</span>
              </div>
            </div>
          ); })}
        </div>
      </Card>

      <Card className="border-yellow-900/40">
        <div className="text-[13px] font-bold text-white mb-2">💊 Supplement Reminders</div>
        <div className="space-y-1">
          <div className="text-[12px] text-[#8a8f99]">🟡 Zincovit — after breakfast</div>
          <div className="text-[12px] text-[#8a8f99]">🟣 Keraglo Eva — at night</div>
        </div>
        <button onClick={function() { onNavigate("supplements"); }} className="mt-2 text-[11px] text-yellow-400">Track today →</button>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// GYM SCREEN
// ─────────────────────────────────────────────

function GymScreen() {
  var today     = todayKey();
  var todayType = getTodayType();
  var initType  = (todayType === "rest" || todayType === "light") ? "upper" : todayType;

  var activeTypeState = useState(initType);
  var activeType      = activeTypeState[0];
  var setActiveType   = activeTypeState[1];

  var gcResult   = useLS("gym_checks_" + today, {});
  var gymChecks  = gcResult[0];
  var setGymChecks = gcResult[1];

  var wlResult   = useLS("workout_log", {});
  var workoutLog  = wlResult[0];
  var setWorkoutLog = wlResult[1];
  var todayWoStat   = workoutLog[today];

  var leResult   = useLS("low_energy_" + today, false);
  var lowEnergy  = leResult[0];
  var setLowEnergy = leResult[1];

  var wlogResult = useLS("exercise_weight_log", {});
  var weightLog  = wlogResult[0];
  var setWeightLog = wlogResult[1];

  var strResult  = useLS("streak_data", { count: 0, lastDate: "" });
  var streak     = strResult[0];
  var setStreak  = strResult[1];

  var exercises   = activeType === "upper" ? UPPER_EXERCISES : LOWER_EXERCISES;
  var doneCount   = exercises.filter(function(e) { return gymChecks[e.id] === "done"; }).length;
  var skipCount   = exercises.filter(function(e) { return gymChecks[e.id] === "skipped"; }).length;
  var consistPct  = exercises.length > 0 ? Math.round((doneCount / exercises.length) * 100) : 0;

  function setExerciseStatus(id, status) {
    setGymChecks(function(prev) {
      var next = Object.assign({}, prev);
      next[id] = prev[id] === status ? null : status;
      return next;
    });
  }

  function setWeight(id, val) {
    var today = todayKey();
    setWeightLog(function(prev) {
      return Object.assign({}, prev, {
        [id]: { value: val, updatedAt: today }
      });
    });
  }

  function markDayAs(status) {
    var isUndoing = workoutLog[today] === status;
    setWorkoutLog(function(prev) {
      var next = Object.assign({}, prev);
      if (isUndoing) { delete next[today]; } else { next[today] = status; }
      return next;
    });
    if (status === "done" && !isUndoing) {
      var yest = new Date(); yest.setDate(yest.getDate() - 1);
      var yKey = yest.getFullYear() + "-" + String(yest.getMonth()+1).padStart(2,"0") + "-" + String(yest.getDate()).padStart(2,"0");
      var newCnt = (streak.lastDate === yKey || streak.lastDate === today)
        ? (streak.lastDate === today ? streak.count : streak.count + 1) : 1;
      setStreak({ count: newCnt, lastDate: today });
    }
    if (status === "done" && isUndoing) {
      setStreak(function(p) { return { count: Math.max(0, p.count - 1), lastDate: p.lastDate }; });
    }
  }

  return (
    <div>
      {/* Low energy toggle */}
      <button
        onClick={function() { setLowEnergy(!lowEnergy); }}
        className={"w-full flex items-center gap-3 p-3 rounded-xl border mb-3 transition-all text-left " + (lowEnergy ? "bg-pink-950/30 border-pink-800/40" : "bg-[#1a1b1e] border-[#2a2c30]")}
      >
        <span className="text-lg">🌸</span>
        <div className="flex-1">
          <div className={"text-[12px] font-semibold " + (lowEnergy ? "text-pink-300" : "text-white")}>Low energy / on period</div>
          {lowEnergy && (
            <div className="text-[11px] text-pink-400/80 mt-0.5">Take it easy today. Consistency matters more than perfection 💕</div>
          )}
        </div>
        <div className={"w-4 h-4 rounded-full border flex-shrink-0 " + (lowEnergy ? "bg-pink-500 border-pink-500" : "border-[#4a4d55]")} />
      </button>

      {/* Split selector */}
      <div className="flex gap-2 mb-3">
        {["upper","lower"].map(function(type) { return (
          <button key={type} onClick={function() { setActiveType(type); }}
            className={"flex-1 py-2.5 rounded-xl border text-[13px] font-bold transition-all " + (activeType === type ? "bg-green-950 border-green-600 text-green-400" : "bg-[#1a1b1e] border-[#2a2c30] text-[#6b6f78]")}>
            {type === "upper" ? "💪 Upper" : "🦵 Lower"}
          </button>
        ); })}
      </div>

      {/* Progress */}
      <Card className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-white">Session Progress</span>
          <span className="text-[12px] font-semibold text-green-400">{doneCount}/{exercises.length}</span>
        </div>
        <ProgressBar value={doneCount} max={exercises.length} />
        <div className="flex justify-between mt-2 text-[10px] text-[#6b6f78]">
          <span>{doneCount} done · {skipCount} skipped</span>
          <span>{consistPct}% completion</span>
        </div>
        {doneCount === exercises.length && exercises.length > 0 && (
          <div className="text-[12px] text-green-400 font-bold mt-2 text-center">🎉 Full workout complete!</div>
        )}
      </Card>

      {/* Day-level status */}
      <Card className="mb-3">
        <div className="text-[12px] font-bold text-white mb-2">Mark today as</div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(WO_STATUS).map(function(entry) {
            var key = entry[0]; var s = entry[1];
            return (
              <button key={key} onClick={function() { markDayAs(key); }}
                className={"py-2 px-1 rounded-lg border text-[11px] font-semibold transition-all " + (todayWoStat === key ? s.bg + " " + s.border + " " + s.color : "bg-[#0e0f11] border-[#2a2c30] text-[#6b6f78]")}>
                {s.emoji} {s.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Exercises */}
      <div className="space-y-2">
        {exercises.map(function(ex) { return (
          <ExerciseCard key={ex.id} exercise={ex}
            status={gymChecks[ex.id] || null}
            onSetStatus={function(st) { setExerciseStatus(ex.id, st); }}
            weight={weightLog[ex.id]?.value || ""}
            onWeightChange={function(v) { setWeight(ex.id, v); }}
            lowEnergy={lowEnergy} />
        ); })}
      </div>

      <Card className="mt-4 border-yellow-900/40">
        <div className="text-[12px] font-bold text-yellow-400 mb-1.5">⚡ Warm-Up (5 min)</div>
        <div className="text-[11px] text-[#8a8f99]">Cross trainer, arm circles, shoulder rolls, 2 warm-up sets at 50%</div>
        <div className="text-[12px] font-bold text-green-400 mt-2 mb-1.5">✅ Cool-Down</div>
        <div className="text-[11px] text-[#8a8f99]">Chest stretch, lat stretch, hamstring, quad, forward fold 60s</div>
      </Card>
    </div>
  );
}

function ExerciseCard({ exercise, status, onSetStatus, weight, onWeightChange, lowEnergy }) {
  var openState = useState(false);
  var open      = openState[0];
  var setOpen   = openState[1];
  var isDone    = status === "done";
  var isSkipped = status === "skipped";

  return (
    <div className={"bg-[#1a1b1e] border rounded-xl overflow-hidden transition-all " + (isDone ? "border-green-800/60" : isSkipped ? "border-yellow-800/40" : "border-[#2a2c30]")}>
      <div className="flex items-center p-3 gap-2">
        <div className="flex gap-1.5 flex-shrink-0">
          <button onClick={function() { onSetStatus("done"); }} title="Mark done"
            className={"w-6 h-6 rounded-md border flex items-center justify-center text-[10px] font-black transition-all " + (isDone ? "bg-green-500 border-green-500 text-black" : "border-[#4a4d55] text-[#4a4d55]")}>
            ✓
          </button>
          <button onClick={function() { onSetStatus("skipped"); }} title="Skip"
            className={"w-6 h-6 rounded-md border flex items-center justify-center text-[11px] transition-all " + (isSkipped ? "bg-yellow-600 border-yellow-600 text-black" : "border-[#4a4d55] text-[#4a4d55]")}>
            –
          </button>
        </div>

        <button onClick={function() { setOpen(!open); }} className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={"text-[13px] font-semibold " + (isDone ? "text-green-300 line-through" : isSkipped ? "text-yellow-400/70 line-through" : "text-white")}>
              {exercise.name}
            </span>
            {exercise.optional && <span className="text-[9px] text-[#6b6f78] border border-[#2a2c30] px-1.5 py-0.5 rounded-full">opt</span>}
          </div>
          <div className="flex gap-1.5 mt-1">
            <span className="text-[10px] bg-green-950 text-green-400 border border-green-900 px-1.5 py-0.5 rounded-full">{exercise.sets}s</span>
            <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-900 px-1.5 py-0.5 rounded-full">{exercise.reps}r</span>
            <span className="text-[10px] bg-yellow-950 text-yellow-400 border border-yellow-900 px-1.5 py-0.5 rounded-full">{exercise.rest}</span>
          </div>
        </button>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {weight && <span className="text-[10px] text-green-400 font-bold">{weight}kg</span>}
          <span className="text-[#6b6f78] text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div className="px-3 pb-3 border-t border-[#2a2c30] pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6b6f78]">Last weight:</span>
            <input type="number" min="0" step="0.5" value={weight}
              onChange={function(e) { onWeightChange(e.target.value); }}
              placeholder="kg"
              className="w-20 bg-[#0e0f11] border border-[#2a2c30] rounded-lg px-2 py-1.5 text-[12px] text-white text-center focus:border-green-600 focus:outline-none" />
            {weight && <span className="text-[11px] text-green-400">saved ✓</span>}
          </div>
          {lowEnergy && (
            <div className="mt-2 text-[11px] text-pink-400/80">💕 Use lighter weight today — that is totally fine.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// DIET SCREEN
// ─────────────────────────────────────────────

function DietScreen() {
  var today = todayKey();
  var CHECKLIST = [
    { key: "workout", label: "Workout Done",              icon: "🏋️" },
    { key: "protein", label: "Protein Target Hit (~90g)", icon: "🥩" },
    { key: "meals",   label: "All Meals Completed",       icon: "🍽️" },
  ];

  var mdResult     = useLS("meal_done_" + today, {});
  var mealDone     = mdResult[0];
  var setMealDone  = mdResult[1];

  var clResult  = useLS("daily_checklist", { date: "", checks: {} });
  var cl        = clResult[0];
  var setCl     = clResult[1];

  var strResult = useLS("streak_data", { count: 0, lastDate: "" });
  var streak    = strResult[0];
  var setStreak = strResult[1];

  var checks = cl.date === today ? cl.checks : {};

  function toggleMeal(id) {
    setMealDone(function(prev) { return Object.assign({}, prev, { [id]: !prev[id] }); });
  }

  function toggleCheck(key) {
    var newChecks = Object.assign({}, checks, { [key]: !checks[key] });
    setCl({ date: today, checks: newChecks });
    if (key === "workout" && !checks[key]) {
      var yest = new Date(); yest.setDate(yest.getDate() - 1);
      var yKey = yest.getFullYear() + "-" + String(yest.getMonth()+1).padStart(2,"0") + "-" + String(yest.getDate()).padStart(2,"0");
      var ns = (streak.lastDate === yKey || streak.lastDate === today) ? (streak.lastDate === today ? streak.count : streak.count + 1) : 1;
      setStreak({ count: ns, lastDate: today });
    }
    if (key === "workout" && checks[key]) {
      setStreak(function(p) { return { count: Math.max(0, p.count - 1), lastDate: p.lastDate }; });
    }
  }

  var mealsDone = DIET_MEALS.filter(function(m) { return mealDone[m.id]; }).length;

  return (
    <div>
      <Card className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-white">📋 Daily Checklist</span>
          <span className="text-[11px] text-[#6b6f78]">{Object.values(checks).filter(Boolean).length}/{CHECKLIST.length}</span>
        </div>
        <div className="space-y-1.5">
          {CHECKLIST.map(function(item) { return (
            <Toggle key={item.key} checked={!!checks[item.key]} onChange={function() { toggleCheck(item.key); }} label={item.label} icon={item.icon} />
          ); })}
        </div>
      </Card>

      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-bold text-white">🍱 Today Meals</span>
        <span className="text-[11px] text-[#6b6f78]">{mealsDone}/{DIET_MEALS.length}</span>
      </div>
      <div className="space-y-2">
        {DIET_MEALS.map(function(meal) { return (
          <Toggle key={meal.id} checked={!!mealDone[meal.id]} onChange={function() { toggleMeal(meal.id); }}
            label={meal.name} sublabel={meal.time + " · " + meal.desc} icon={meal.icon} />
        ); })}
      </div>

      <SectionTitle>🥗 Protein Sources</SectionTitle>
      <Card>
        {[["⭐ Roasted Soya 30g","13g"],["🥪 PB Sandwich","10-12g"],["Dal 1 cup","9g"],["Peanuts 30g","8g"],["Curd 100g","4g"],["Oats 60g","9g"]].map(function(row) { return (
          <div key={row[0]} className="flex justify-between py-1.5 border-b border-[#2a2c30] last:border-0">
            <span className="text-[12px] text-white">{row[0]}</span>
            <span className="text-[12px] text-green-400 font-bold">{row[1]}</span>
          </div>
        ); })}
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// SUPPLEMENTS SCREEN
// ─────────────────────────────────────────────

function SupplementsScreen() {
  var today    = todayKey();
  var scResult = useLS("supp_checks_" + today, {});
  var suppChecks    = scResult[0];
  var setSuppChecks = scResult[1];
  var doneCount = SUPPLEMENTS_LIST.filter(function(s) { return suppChecks[s.id]; }).length;

  function toggle(id) {
    setSuppChecks(function(prev) { return Object.assign({}, prev, { [id]: !prev[id] }); });
  }

  return (
    <div>
      <Card className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-white">💊 Today Supplements</span>
          <span className={"text-[12px] font-bold " + (doneCount === SUPPLEMENTS_LIST.length ? "text-green-400" : "text-[#6b6f78]")}>
            {doneCount}/{SUPPLEMENTS_LIST.length}
          </span>
        </div>
        <ProgressBar value={doneCount} max={SUPPLEMENTS_LIST.length} color="bg-yellow-500" />
      </Card>
      <div className="space-y-2">
        {SUPPLEMENTS_LIST.map(function(s) { return (
          <button key={s.id} onClick={function() { toggle(s.id); }}
            className={"w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left " + (suppChecks[s.id] ? s.bg + " " + s.border : "bg-[#1a1b1e] border-[#2a2c30]")}>
            <span className="text-xl flex-shrink-0">{s.icon}</span>
            <div className="flex-1">
              <div className={"text-[13px] font-bold " + (suppChecks[s.id] ? s.color : "text-white")}>{s.name}</div>
              <div className="text-[11px] text-[#6b6f78] mt-0.5">⏰ {s.timing}</div>
            </div>
            <div className={"w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 " + (suppChecks[s.id] ? "bg-green-500 border-green-500" : "border-[#4a4d55]")}>
              {suppChecks[s.id] && <span className="text-black text-[10px] font-black">✓</span>}
            </div>
          </button>
        ); })}
      </div>
      <Card className="mt-4 border-[#1e4d2e]">
        <div className="text-[12px] font-bold text-green-400 mb-2">📋 Notes</div>
        <div className="space-y-1.5 text-[11px] text-[#8a8f99]">
          <div>• Zincovit covers biotin + zinc — good for hair too</div>
          <div>• Vitamin D3 with food for better absorption</div>
          <div>• Creatine: start only after Month 2-3 of consistent training</div>
          <div>• If hairfall persists after 2 months, consult a doctor</div>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// PROGRESS SCREEN
// ─────────────────────────────────────────────

function ProgressScreen() {
  var today = todayKey();

  var whResult    = useLS("weight_history", []);
  var weightHistory    = whResult[0];
  var setWeightHistory = whResult[1];

  var gwResult  = useLS("goal_weight", "53");
  var goalWeight    = gwResult[0];
  var setGoalWeight = gwResult[1];

  var inputWState = useState("");
  var inputWeight     = inputWState[0];
  var setInputWeight  = inputWState[1];

  var inputGState = useState(goalWeight);
  var inputGoal       = inputGState[0];
  var setInputGoal    = inputGState[1];

  var latestEntry  = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1] : null;
  var latestW      = latestEntry ? parseFloat(latestEntry.weight) : null;
  var firstW       = weightHistory.length > 0 ? parseFloat(weightHistory[0].weight) : null;
  var goal         = parseFloat(goalWeight);
  var progressPct  = (firstW && latestW && goal > firstW) ? Math.min(100, Math.max(0, Math.round(((latestW - firstW) / (goal - firstW)) * 100))) : 0;
  var remaining    = latestW && !isNaN(goal) ? (goal - latestW).toFixed(1) : null;
  var daysSinceW   = latestEntry ? daysSince(latestEntry.date) : null;

  function logWeight() {
    var w = parseFloat(inputWeight.trim());
    if (!w || isNaN(w) || w < 20 || w > 200) return;
    setWeightHistory(function(prev) {
      var filtered = prev.filter(function(e) { return e.date !== today; });
      return filtered.concat([{ date: today, weight: String(w) }]).slice(-90);
    });
    setInputWeight("");
  }

  var woLogResult   = useLS("workout_log", {});
  var workoutLog    = woLogResult[0];
  var strResult     = useLS("streak_data", { count: 0, lastDate: "" });
  var streak        = strResult[0];

  var woEntries   = Object.values(workoutLog);
  var totalDone   = woEntries.filter(function(v) { return v === "done"; }).length;
  var totalSkip   = woEntries.filter(function(v) { return v === "skipped"; }).length;
  var totalLogged = totalDone + totalSkip;
  var consPct     = totalLogged > 0 ? Math.round((totalDone / totalLogged) * 100) : 0;

  var slResult    = useLS("exercise_weight_log", {});
  var strengthLog = slResult[0];
  var allEx       = UPPER_EXERCISES.concat(LOWER_EXERCISES);
  var loggedEx    = allEx.filter(function(e) { return strengthLog[e.id]?.value; });

  return (
    <div>
      {streak.count > 0 && (
        <Card className="mb-3 bg-gradient-to-r from-[#2a1a05] to-[#1a1b1e] border-orange-800/40">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <div className="text-xl font-black text-orange-400">{streak.count} Day Streak</div>
              <div className="text-[11px] text-[#8a8f99]">Skipping a day does not break this — only missing keeps it going!</div>
            </div>
          </div>
        </Card>
      )}

      {/* Weight tracker */}
      <Card className="mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[13px] font-bold text-white">⚖️ Weight Tracker</div>
          {daysSinceW !== null && (
            <div className={"text-[10px] font-semibold px-2 py-0.5 rounded-full border " + (daysSinceW >= 30 ? "text-yellow-400 bg-yellow-950/30 border-yellow-800/40" : "text-green-400 bg-green-950/30 border-green-800/40")}>
              {daysSinceW >= 30 ? "⚠️ Update needed" : "Updated " + daysSinceW + "d ago"}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-[10px] text-[#6b6f78] uppercase tracking-wide block mb-1">
              {daysSinceW === null || daysSinceW >= 30 ? "⚠️ Log weight (kg)" : "Log weight (kg)"}
            </label>
            <div className="flex gap-1.5">
              <input type="number" min="20" max="200" step="0.1" value={inputWeight}
                onChange={function(e) { setInputWeight(e.target.value); }}
                onKeyDown={function(e) { if (e.key === "Enter") logWeight(); }}
                placeholder={latestW ? String(latestW) : "e.g. 42"}
                className="flex-1 bg-[#0e0f11] border border-[#2a2c30] rounded-lg px-2 py-2 text-[13px] text-white focus:border-green-600 focus:outline-none" />
              <button onClick={logWeight} className="bg-green-900 border border-green-700 text-green-400 px-3 py-2 rounded-lg text-[12px] font-bold">Save</button>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-[#6b6f78] uppercase tracking-wide block mb-1">Goal (kg)</label>
            <div className="flex gap-1.5">
              <input type="number" min="20" max="200" step="0.1" value={inputGoal}
                onChange={function(e) { setInputGoal(e.target.value); }}
                className="flex-1 bg-[#0e0f11] border border-[#2a2c30] rounded-lg px-2 py-2 text-[13px] text-white focus:border-blue-600 focus:outline-none" />
              <button onClick={function() { setGoalWeight(inputGoal); }} className="bg-blue-950 border border-blue-800 text-blue-400 px-3 py-2 rounded-lg text-[12px] font-bold">Set</button>
            </div>
          </div>
        </div>

        {(daysSinceW === null || daysSinceW >= 30) && (
          <div className="text-[11px] text-yellow-400/80 bg-yellow-950/20 border border-yellow-800/30 rounded-lg px-3 py-2 mb-3">
            {daysSinceW === null ? "👋 Log your starting weight to track your journey!" : "It has been " + daysSinceW + " days since your last weigh-in. Tap Save to update."}
          </div>
        )}

        {latestW && (
          <>
            <div className="flex justify-between text-[11px] text-[#6b6f78] mb-1">
              <span>Start: {firstW}kg</span>
              <span className="text-green-400 font-bold">{progressPct}%</span>
              <span>Goal: {goalWeight}kg</span>
            </div>
            <ProgressBar value={progressPct} max={100} />
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="text-center">
                <div className="text-xl font-black text-white">{latestW}kg</div>
                <div className="text-[10px] text-[#6b6f78] uppercase">Current</div>
              </div>
              <div className="text-center">
                <div className={"text-xl font-black " + (remaining > 0 ? "text-yellow-400" : "text-green-400")}>
                  {remaining !== null ? (remaining > 0 ? "+" + remaining + "kg" : "Goal reached!") : "—"}
                </div>
                <div className="text-[10px] text-[#6b6f78] uppercase">Remaining</div>
              </div>
            </div>
          </>
        )}
      </Card>

      {weightHistory.length > 0 && (
        <Card className="mb-3">
          <div className="text-[13px] font-bold text-white mb-2">📅 Weight History</div>
          {[].concat(weightHistory).reverse().slice(0, 10).map(function(e, i) { return (
            <div key={i} className="flex justify-between py-1.5 border-b border-[#2a2c30] last:border-0">
              <span className="text-[12px] text-[#8a8f99]">{e.date}</span>
              <span className="text-[13px] font-bold text-white">{e.weight} kg</span>
            </div>
          ); })}
        </Card>
      )}

      <Card className="mb-3">
        <div className="text-[13px] font-bold text-white mb-3">💪 Workout Stats</div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="bg-[#0e0f11] border border-[#2a2c30] rounded-xl p-2.5 text-center">
            <div className="text-lg font-black text-green-400">{totalDone}</div>
            <div className="text-[9px] text-[#6b6f78] uppercase mt-0.5">Completed</div>
          </div>
          <div className="bg-[#0e0f11] border border-[#2a2c30] rounded-xl p-2.5 text-center">
            <div className="text-lg font-black text-yellow-400">{totalSkip}</div>
            <div className="text-[9px] text-[#6b6f78] uppercase mt-0.5">Skipped</div>
          </div>
          <div className="bg-[#0e0f11] border border-[#2a2c30] rounded-xl p-2.5 text-center">
            <div className="text-lg font-black text-blue-400">{consPct}%</div>
            <div className="text-[9px] text-[#6b6f78] uppercase mt-0.5">Consistency</div>
          </div>
        </div>
        <div className="text-[11px] text-pink-400/70">💕 Skipped days do not break your streak — showing up is what counts</div>
      </Card>

      {loggedEx.length > 0 && (
        <Card className="mb-3">
          <div className="text-[13px] font-bold text-white mb-2">🏋️ Last Logged Weights</div>
          <div className="space-y-1.5">
            {loggedEx.map(function(ex) { return (
              <div key={ex.id} className="flex justify-between items-center">
                <span className="text-[12px] text-[#8a8f99]">{ex.name}</span>
                <span className="text-[12px] font-bold text-green-400">{strengthLog[ex.id]?.value} kg</span>
                {strengthLog[ex.id]?.updatedAt && (
                  <div className="text-[10px] text-[#6b6f78]">
                    updated {strengthLog[ex.id].updatedAt}
                  </div>
                )}
              </div>
            ); })}
          </div>
        </Card>
      )}

      <WeeklySummaryCard />
    </div>
  );
}

function WeeklySummaryCard() {
  var d    = new Date();
  var jan1 = new Date(d.getFullYear(), 0, 1);
  var week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  var weekKey = d.getFullYear() + "-W" + week;

  var weekData = {};
  try { weekData = JSON.parse(localStorage.getItem("weekly_history") || "{}")[weekKey] || {}; } catch(e) {}

  var wlResult    = useLS("workout_log", {});
  var workoutLog  = wlResult[0];
  var woEntries   = Object.values(workoutLog);
  var gymDays     = woEntries.filter(function(v) { return v === "done"; }).length;
  var skippedDays = woEntries.filter(function(v) { return v === "skipped"; }).length;

  var days      = Object.values(weekData);
  var protDays  = days.filter(function(d) { return d.protein; }).length;
  var totChecks = days.reduce(function(s, d) { return s + Object.values(d).filter(Boolean).length; }, 0);
  var maxChecks = days.length * 3;
  var pct       = maxChecks > 0 ? Math.round((totChecks / maxChecks) * 100) : 0;

  return (
    <Card>
      <div className="text-[13px] font-bold text-white mb-2">📊 This Week</div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-[#0e0f11] border border-[#2a2c30] rounded-xl p-2.5 text-center">
          <div className="text-lg font-black text-green-400">{gymDays}/4</div>
          <div className="text-[9px] text-[#6b6f78] uppercase mt-0.5">Gym Days</div>
        </div>
        <div className="bg-[#0e0f11] border border-[#2a2c30] rounded-xl p-2.5 text-center">
          <div className="text-lg font-black text-yellow-400">{skippedDays}</div>
          <div className="text-[9px] text-[#6b6f78] uppercase mt-0.5">Skipped</div>
        </div>
        <div className="bg-[#0e0f11] border border-[#2a2c30] rounded-xl p-2.5 text-center">
          <div className="text-lg font-black text-blue-400">{protDays}/7</div>
          <div className="text-[9px] text-[#6b6f78] uppercase mt-0.5">Protein Days</div>
        </div>
        <div className="bg-[#0e0f11] border border-[#2a2c30] rounded-xl p-2.5 text-center">
          <div className="text-lg font-black text-purple-400">{pct}%</div>
          <div className="text-[9px] text-[#6b6f78] uppercase mt-0.5">Completion</div>
        </div>
      </div>
      {skippedDays > 0 && (
        <div className="text-[11px] text-pink-400/70 mt-1">
          💕 {skippedDays} skipped day{skippedDays > 1 ? "s" : ""} — that is okay. Showing up matters most.
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────

var NAV = [
  { key: "home",        icon: "🏠", label: "Home"     },
  { key: "gym",         icon: "🏋️", label: "Gym"      },
  { key: "diet",        icon: "🍱", label: "Diet"     },
  { key: "supplements", icon: "💊", label: "Supps"    },
  { key: "progress",    icon: "📈", label: "Progress" },
];

var PAGE_TITLES = {
  home: "Today", gym: "Gym Plan", diet: "Diet & Meals",
  supplements: "Supplements", progress: "My Progress",
};

export default function App() {
  var tabState = useState("home");
  var tab      = tabState[0];
  var setTab   = tabState[1];

  function navigate(t) { setTab(t); window.scrollTo({ top: 0, behavior: "smooth" }); }

  return (
    <div className="bg-[#0e0f11] min-h-screen text-white max-w-md mx-auto relative">
      <div className="sticky top-0 z-40 bg-[#0e0f11] border-b border-[#2a2c30] px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-[9px] text-[#6b6f78] uppercase tracking-widest">Priyal's</div>
          <div className="text-[16px] font-black text-white">{PAGE_TITLES[tab]}</div>
        </div>
        <div className="bg-green-950 border border-green-800 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-full">🏋️ Beginner</div>
      </div>

      <div className="px-4 pt-4 pb-28">
        {tab === "home"        && <HomeScreen onNavigate={navigate} />}
        {tab === "gym"         && <GymScreen />}
        {tab === "diet"        && <DietScreen />}
        {tab === "supplements" && <SupplementsScreen />}
        {tab === "progress"    && <ProgressScreen />}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-[#0e0f11] border-t border-[#2a2c30]">
        <div className="flex">
          {NAV.map(function(item) {
            var active = tab === item.key;
            return (
              <button key={item.key} onClick={function() { navigate(item.key); }}
                className={"flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors " + (active ? "text-green-400" : "text-[#6b6f78]")}>
                <span className="text-lg leading-none">{item.icon}</span>
                <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
                {active && <div className="w-1 h-1 rounded-full bg-green-400 mt-0.5" />}
              </button>
            );
          })}
        </div>
        <div className="h-safe-area-inset-bottom" />
      </div>
    </div>
  );
}
