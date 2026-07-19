import { useState, useEffect } from "react";
import {
  GraduationCap, Lock, Mail, Eye, EyeOff, LayoutDashboard, FilePlus, FileText,
  Settings, LogOut, Bell, Search, CheckCircle2, XCircle, Clock, ArrowRight,
  ArrowLeft, ChevronDown, Menu, X, Printer, Download, Calendar, Phone,
  Building2, ClipboardList, Send, ShieldCheck, UserCog, Briefcase, Award,
  Percent, RotateCcw, IdCard, School, Users, User, PiggyBank, BookOpen,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const DEPARTMENTS = [
  "Information Technology",
  "Computer Science and Engineering",
  "Computer Science and Business Systems",
  "Artificial Intelligence and Data Science",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
];
const SECTIONS = ["A", "B", "C"];
const YEARS = ["I", "II", "III", "IV"];
const QUOTAS = ["Government Quota", "Management Quota", "Sports Quota"];
const CERT_TYPES = ["10th Marksheet", "12th Marksheet", "Transfer Certificate", "UG Degree Certificate"];
const REASONS = ["Higher Studies", "Passport Verification", "Visa Process", "Government Verification", "Employment", "Others"];

const SERVICES = [
  { key: "original", title: "Original Certificate Issue", desc: "Request your original academic certificates", icon: FileText, color: "blue" },
  { key: "loan", title: "Educational Loan", desc: "Bonafide & documents for education loans", icon: PiggyBank, color: "emerald" },
  { key: "scholarship", title: "Scholarship Bonafide", desc: "Bonafide certificate for scholarship claims", icon: Award, color: "amber" },
  { key: "fee", title: "Fee Card / CGPA / Percentage", desc: "Academic performance certificates", icon: Percent, color: "violet" },
];

const STEPS = ["Submitted", "Tutor", "HOD", "Office Staff", "DRSS / Closed"];

const STATUS_META = {
  "Pending":            { step: 0, badge: "bg-amber-50 text-amber-700 border-amber-200" },
  "Tutor Approved":     { step: 1, badge: "bg-blue-50 text-blue-700 border-blue-200" },
  "HOD Approved":       { step: 2, badge: "bg-blue-50 text-blue-700 border-blue-200" },
  "With Office Staff":  { step: 3, badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  "Issued":             { step: 3, badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  "Closed":             { step: 4, badge: "bg-slate-100 text-slate-600 border-slate-200" },
  "Completed":          { step: 4, badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "Rejected":           { step: -1, badge: "bg-red-50 text-red-700 border-red-200" },
};

const INITIAL_APPS = [
  { id: 1, reqNo: "REQ-2026-1042", student: "Aravind Kumar", reg: "9520221CS042", dept: "Computer Science and Engineering", year: "III", cert: "Transfer Certificate", reason: "Higher Studies", applied: "2026-07-01", status: "Pending", contact: "+91 98765 43210", issue: "", ret: "" },
  { id: 2, reqNo: "REQ-2026-1043", student: "Divya Sri", reg: "9520221IT018", dept: "Information Technology", year: "IV", cert: "UG Degree Certificate", reason: "Passport Verification", applied: "2026-06-28", status: "Tutor Approved", contact: "+91 98456 11223", issue: "", ret: "" },
  { id: 3, reqNo: "REQ-2026-1044", student: "Mohammed Rafi", reg: "9520221EC009", dept: "Electronics and Communication Engineering", year: "II", cert: "12th Marksheet", reason: "Visa Process", applied: "2026-06-25", status: "HOD Approved", contact: "+91 90477 88221", issue: "", ret: "" },
  { id: 4, reqNo: "REQ-2026-1045", student: "Priya Dharshini", reg: "9520221AI005", dept: "Artificial Intelligence and Data Science", year: "III", cert: "10th Marksheet", reason: "Government Verification", applied: "2026-06-20", status: "Issued", contact: "+91 63801 22456", issue: "2026-06-22", ret: "" },
  { id: 5, reqNo: "REQ-2026-1046", student: "Karthik Raja", reg: "9520221ME031", dept: "Mechanical Engineering", year: "IV", cert: "UG Degree Certificate", reason: "Employment", applied: "2026-06-10", status: "Closed", contact: "+91 91234 55667", issue: "2026-06-12", ret: "2026-06-30" },
  { id: 6, reqNo: "REQ-2026-1047", student: "Sneha Lakshmi", reg: "9520221CB012", dept: "Computer Science and Business Systems", year: "I", cert: "Transfer Certificate", reason: "Others", applied: "2026-06-05", status: "Rejected", contact: "+91 89765 32109", issue: "", ret: "" },
  { id: 7, reqNo: "REQ-2026-1048", student: "Ganesh Prasath", reg: "9520221CE027", dept: "Civil Engineering", year: "II", cert: "12th Marksheet", reason: "Higher Studies", applied: "2026-05-29", status: "Completed", contact: "+91 87654 90123", issue: "2026-06-01", ret: "2026-06-15" },
  { id: 8, reqNo: "REQ-2026-1049", student: "Nandhini R", reg: "9520221EE014", dept: "Electrical and Electronics Engineering", year: "III", cert: "UG Degree Certificate", reason: "Passport Verification", applied: "2026-07-05", status: "Pending", contact: "+91 96543 21098", issue: "", ret: "" },
];

/* ------------------------------------------------------------------ */
/* Small shared UI primitives                                          */
/* ------------------------------------------------------------------ */

function cx(...a) { return a.filter(Boolean).join(" "); }

function Badge({ status }) {
  const meta = STATUS_META[status] || STATUS_META["Pending"];
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap", meta.badge)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function Logo({ size = "md" }) {
  const dims = size === "lg" ? "h-14 w-14" : "h-9 w-9";
  return (
    <div className={cx(dims, "rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0")}>
      <GraduationCap className={size === "lg" ? "h-8 w-8" : "h-5 w-5"} strokeWidth={2.25} />
    </div>
  );
}

function Field({ label, children, className }) {
  return (
    <label className={cx("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const selectCls = inputCls + " appearance-none pr-9";

function Select({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select value={value} onChange={onChange} className={selectCls}>
        <option value="">{placeholder || "Select"}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function Button({ children, variant = "primary", className, ...props }) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
  };
  return (
    <button {...props} className={cx("inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed", variants[variant], className)}>
      {children}
    </button>
  );
}

function Card({ children, className }) {
  return <div className={cx("rounded-xl border border-slate-200 bg-white", className)}>{children}</div>;
}

function StatCard({ label, value, icon: Icon, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600", amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600", red: "bg-red-50 text-red-600",
    indigo: "bg-indigo-50 text-indigo-600", slate: "bg-slate-100 text-slate-600",
  };
  return (
    <Card className="p-5 flex items-center gap-4 hover:shadow-md hover:shadow-slate-100 transition">
      <div className={cx("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", tones[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-900 leading-none">{value}</p>
        <p className="mt-1 text-sm text-slate-500">{label}</p>
      </div>
    </Card>
  );
}

/* Toasts */
function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div key={t.id} className={cx(
          "rounded-xl border px-4 py-3 text-sm shadow-lg flex items-start gap-2 animate-[fadeIn_0.2s_ease]",
          t.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"
        )}>
          {t.type === "error" ? <XCircle className="h-4 w-4 mt-0.5 shrink-0" /> : <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* Confirm dialog */
function ConfirmDialog({ open, title, message, tone = "primary", onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant={tone} onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}

/* Progress stepper for tracking an application */
function Stepper({ status }) {
  const meta = STATUS_META[status] || STATUS_META["Pending"];
  if (status === "Rejected") {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
        <XCircle className="h-4 w-4" /> Application Rejected
      </div>
    );
  }
  return (
    <div className="flex items-center">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5 min-w-[64px]">
            <div className={cx(
              "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border-2",
              i < meta.step ? "bg-blue-600 border-blue-600 text-white" :
              i === meta.step ? "border-blue-600 text-blue-600 bg-blue-50" :
              "border-slate-200 text-slate-300 bg-white"
            )}>
              {i < meta.step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cx("text-[11px] text-center leading-tight", i <= meta.step ? "text-slate-700 font-medium" : "text-slate-400")}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cx("h-0.5 flex-1 mx-1 rounded", i < meta.step ? "bg-blue-600" : "bg-slate-200")} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Landing                                                              */
/* ------------------------------------------------------------------ */

function Landing({ navigate }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <Logo size="lg" />
        <h1 className="mt-6 text-2xl sm:text-3xl font-semibold text-slate-900 text-center tracking-tight">
          PSNA College of Engineering and Technology
        </h1>
        <p className="mt-2 text-blue-600 font-medium tracking-wide text-sm sm:text-base">SMART STUDENT SERVICE PORTAL</p>
        <p className="mt-3 max-w-md text-center text-sm text-slate-500">
          One portal to apply, track, and manage certificate requests, bonafides and academic documents — end to end.
        </p>

        <div className="mt-10 grid w-full max-w-2xl grid-cols-1 sm:grid-cols-2 gap-5">
          <button onClick={() => navigate("student-login")} className="group text-left rounded-xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-lg hover:shadow-blue-100 hover:border-blue-300 transition">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <User className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">Student Login</h2>
            <p className="mt-1.5 text-sm text-slate-500">Apply for certificates and track your requests.</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600">
              Continue <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </button>

          <button onClick={() => navigate("staff-login")} className="group text-left rounded-xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-lg hover:shadow-blue-100 hover:border-blue-300 transition">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <UserCog className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">Staff Login</h2>
            <p className="mt-1.5 text-sm text-slate-500">Tutor, HOD, Office Staff & DRSS workflows.</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600">
              Continue <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
      <footer className="py-5 text-center text-xs text-slate-400">© 2026 PSNA College of Engineering and Technology · Smart Student Service Portal</footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Auth: Student Login / Signup / Staff Login                          */
/* ------------------------------------------------------------------ */

function AuthShell({ children, navigate, wide }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
      <button onClick={() => navigate("landing")} className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </button>
      <div className={cx("w-full", wide ? "max-w-2xl" : "max-w-md")}>
        <div className="flex items-center justify-center gap-2 mb-6">
          <Logo />
          <span className="font-semibold text-slate-900 text-sm">PSNA · Student Service Portal</span>
        </div>
        <Card className="p-7 sm:p-8 shadow-sm">{children}</Card>
      </div>
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder || "••••••••"} className={cx(inputCls, "pl-10 pr-10")} />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function StudentLogin({ navigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  return (
    <AuthShell navigate={navigate}>
      <h1 className="text-xl font-semibold text-slate-900">Student Login</h1>
      <p className="mt-1 text-sm text-slate-500">Sign in to continue to your dashboard.</p>

      <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(email || "student@psnacet.edu.in"); }}>
        <Field label="Email Address">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@psnacet.edu.in" className={cx(inputCls, "pl-10")} />
          </div>
        </Field>
        <Field label="Password">
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 text-slate-600">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            Remember me
          </label>
          <button type="button" className="text-blue-600 font-medium hover:underline">Forgot Password?</button>
        </div>

        <Button type="submit" className="w-full mt-2">Login</Button>
        <Button type="button" variant="secondary" className="w-full" onClick={() => navigate("student-signup")}>Sign Up</Button>
      </form>
    </AuthShell>
  );
}

function StudentSignup({ navigate, onSignup }) {
  const [form, setForm] = useState({
    name: "", reg: "", roll: "", batch: "", dept: "", section: "", year: "",
    quota: "", gender: "", tutor: "", phone: "", email: "", password: "", confirm: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AuthShell navigate={navigate} wide>
      <h1 className="text-xl font-semibold text-slate-900">Create Student Account</h1>
      <p className="mt-1 text-sm text-slate-500">Fill in your academic details to register.</p>

      <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); onSignup(form.email || "student@psnacet.edu.in"); }}>
        <Field label="Student Name"><input required value={form.name} onChange={set("name")} className={inputCls} placeholder="Full name" /></Field>
        <Field label="Registration Number"><input required value={form.reg} onChange={set("reg")} className={inputCls} placeholder="9520221CS042" /></Field>

        <Field label="Roll Number"><input required value={form.roll} onChange={set("roll")} className={inputCls} placeholder="Roll number" /></Field>
        <Field label="Batch"><input required value={form.batch} onChange={set("batch")} className={inputCls} placeholder="2023 - 2027" /></Field>

        <Field label="Department"><Select value={form.dept} onChange={set("dept")} options={DEPARTMENTS} placeholder="Select department" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Section"><Select value={form.section} onChange={set("section")} options={SECTIONS} placeholder="Section" /></Field>
          <Field label="Year"><Select value={form.year} onChange={set("year")} options={YEARS} placeholder="Year" /></Field>
        </div>

        <Field label="Quota"><Select value={form.quota} onChange={set("quota")} options={QUOTAS} placeholder="Select quota" /></Field>
        <Field label="Gender">
          <div className="flex gap-2 pt-1">
            {["Male", "Female"].map((g) => (
              <button type="button" key={g} onClick={() => setForm((f) => ({ ...f, gender: g }))}
                className={cx("flex-1 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition", form.gender === g ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                {g}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Tutor Name"><input required value={form.tutor} onChange={set("tutor")} className={inputCls} placeholder="Tutor's name" /></Field>
        <Field label="Phone Number">
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input required value={form.phone} onChange={set("phone")} className={cx(inputCls, "pl-10")} placeholder="+91 98765 43210" />
          </div>
        </Field>

        <Field label="Email Address" className="sm:col-span-2">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="email" required value={form.email} onChange={set("email")} className={cx(inputCls, "pl-10")} placeholder="you@psnacet.edu.in" />
          </div>
        </Field>

        <Field label="Password"><PasswordInput value={form.password} onChange={set("password")} /></Field>
        <Field label="Confirm Password"><PasswordInput value={form.confirm} onChange={set("confirm")} /></Field>

        <div className="sm:col-span-2 flex gap-3 mt-2">
          <Button type="submit" className="flex-1">Register</Button>
          <Button type="button" variant="secondary" onClick={() => navigate("student-login")}>Already have an account?</Button>
        </div>
      </form>
    </AuthShell>
  );
}

const STAFF_ROLES = [
  { key: "tutor", label: "Tutor", icon: User },
  { key: "hod", label: "HOD", icon: Building2 },
  { key: "os", label: "Office Staff", icon: Briefcase },
  { key: "drss", label: "DRSS", icon: ShieldCheck },
];

function StaffLogin({ navigate, onLogin }) {
  const [role, setRole] = useState("tutor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthShell navigate={navigate}>
      <h1 className="text-xl font-semibold text-slate-900">Staff Login</h1>
      <p className="mt-1 text-sm text-slate-500">Select your role and sign in.</p>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {STAFF_ROLES.map((r) => (
          <button key={r.key} onClick={() => setRole(r.key)} className={cx(
            "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition",
            role === r.key ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"
          )}>
            <r.icon className="h-4 w-4" />
            {r.label}
          </button>
        ))}
      </div>

      <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(role, email || `${role}@psnacet.edu.in`); }}>
        <Field label="Email">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@psnacet.edu.in" className={cx(inputCls, "pl-10")} />
          </div>
        </Field>
        <Field label="Password">
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Button type="submit" className="w-full mt-2">Login as {STAFF_ROLES.find((r) => r.key === role).label}</Button>
      </form>
    </AuthShell>
  );
}

/* ------------------------------------------------------------------ */
/* App shell (topbar + sidebar) shared by all dashboards                */
/* ------------------------------------------------------------------ */

function Topbar({ title, userName, onMenu, onLogout }) {
  return (
    <header className="h-16 shrink-0 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="lg:hidden text-slate-500"><Menu className="h-5 w-5" /></button>
        <h1 className="text-base sm:text-lg font-semibold text-slate-900">{title}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
            {userName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
          <span className="text-sm font-medium text-slate-700">{userName}</span>
        </div>
        <button onClick={onLogout} title="Logout" className="p-2 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-600">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function Sidebar({ items, active, onSelect, open, onClose, roleLabel }) {
  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden" />}
      <aside className={cx(
        "fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 bg-white border-r border-slate-200 z-40 flex flex-col transition-transform duration-200",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-200">
          <Logo />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">PSNA CET</p>
            <p className="text-[11px] text-slate-400">{roleLabel}</p>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-slate-400"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map((it) => (
            <button key={it.key} onClick={() => { onSelect(it.key); onClose(); }} className={cx(
              "w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
              active === it.key ? "bg-blue-600 text-white shadow-sm shadow-blue-200" : "text-slate-600 hover:bg-slate-100"
            )}>
              <it.icon className="h-4 w-4" />
              {it.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 text-[11px] text-slate-400">
          Smart Student Service Portal · v1.0
        </div>
      </aside>
    </>
  );
}

function DashboardShell({ title, roleLabel, userName, navItems, active, onSelect, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar items={navItems} active={active} onSelect={onSelect} open={sidebarOpen} onClose={() => setSidebarOpen(false)} roleLabel={roleLabel} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} userName={userName} onMenu={() => setSidebarOpen(true)} onLogout={onLogout} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Student side                                                         */
/* ------------------------------------------------------------------ */

const studentNav = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "apply", label: "Apply Certificate", icon: FilePlus },
  { key: "myapps", label: "My Applications", icon: FileText },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "profile", label: "Profile", icon: User },
];

function StudentOverview({ apps, navigate, onQuickApply }) {
  const mine = apps.slice(0, 4);
  const colorMap = { blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600", emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600", amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-600", violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-600" };
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 border-0 text-white">
        <p className="text-sm text-blue-100">Welcome back,</p>
        <h2 className="text-xl font-semibold mt-0.5">Aravind Kumar · III Year, CSE</h2>
        <p className="mt-2 text-sm text-blue-100">Track requests, apply for certificates, and stay updated on approval status — all in one place.</p>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Apply for a service</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {SERVICES.map((s) => (
            <button key={s.key} onClick={() => onQuickApply(s.key)} className="group text-left rounded-xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:shadow-slate-100 hover:border-blue-300 transition">
              <div className={cx("h-11 w-11 rounded-xl flex items-center justify-center transition group-hover:text-white", colorMap[s.color])}>
                <s.icon className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-slate-900">{s.title}</h4>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">Recent applications</h3>
          <button onClick={() => navigate("myapps")} className="text-xs font-medium text-blue-600 hover:underline">View all</button>
        </div>
        <Card className="divide-y divide-slate-100 overflow-hidden">
          {mine.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{a.cert}</p>
                <p className="text-xs text-slate-400">{a.reqNo} · Applied {a.applied}</p>
              </div>
              <Badge status={a.status} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function ApplyCertificate({ onSubmit, onCancel }) {
  const [certType, setCertType] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <Card className="max-w-xl p-6 sm:p-7">
      <div className="flex items-center gap-3 mb-1">
        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><FilePlus className="h-5 w-5" /></div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Original Certificate Issue</h2>
          <p className="text-xs text-slate-500">Submit a request for your original documents</p>
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); if (!certType || !reason) return; onSubmit({ cert: certType, reason }); }}>
        <Field label="Certificate Type"><Select value={certType} onChange={(e) => setCertType(e.target.value)} options={CERT_TYPES} placeholder="Select certificate" /></Field>
        <Field label="Reason"><Select value={reason} onChange={(e) => setReason(e.target.value)} options={REASONS} placeholder="Select reason" /></Field>
        <Field label="Additional Notes (optional)">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputCls} placeholder="Any extra details for the reviewer..." />
        </Field>
        <div className="flex gap-3 pt-1">
          <Button type="submit" className="flex-1">Submit Request</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}

function ApplicationDetailModal({ app, onClose }) {
  if (!app) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{app.cert}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{app.reqNo}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-6"><Stepper status={app.status} /></div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-slate-400 text-xs">Student</p><p className="font-medium text-slate-800 mt-0.5">{app.student}</p></div>
          <div><p className="text-slate-400 text-xs">Register No.</p><p className="font-medium text-slate-800 mt-0.5">{app.reg}</p></div>
          <div><p className="text-slate-400 text-xs">Department</p><p className="font-medium text-slate-800 mt-0.5">{app.dept}</p></div>
          <div><p className="text-slate-400 text-xs">Reason</p><p className="font-medium text-slate-800 mt-0.5">{app.reason}</p></div>
          <div><p className="text-slate-400 text-xs">Applied Date</p><p className="font-medium text-slate-800 mt-0.5">{app.applied}</p></div>
          <div><p className="text-slate-400 text-xs">Status</p><p className="mt-0.5"><Badge status={app.status} /></p></div>
        </div>

        <Button className="w-full mt-6" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

function MyApplications({ apps }) {
  const [q, setQ] = useState("");
  const [viewApp, setViewApp] = useState(null);
  const filtered = apps.filter((a) => a.cert.toLowerCase().includes(q.toLowerCase()) || a.reqNo.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by certificate or request no." className={cx(inputCls, "pl-10")} />
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3 font-medium">Request No.</th>
              <th className="px-5 py-3 font-medium">Certificate</th>
              <th className="px-5 py-3 font-medium">Applied Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-5 py-3.5 text-slate-500">{a.reqNo}</td>
                <td className="px-5 py-3.5 font-medium text-slate-800">{a.cert}</td>
                <td className="px-5 py-3.5 text-slate-500">{a.applied}</td>
                <td className="px-5 py-3.5"><Badge status={a.status} /></td>
                <td className="px-5 py-3.5 text-right">
                  <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => setViewApp(a)}>View</Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400">No applications found.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
      <ApplicationDetailModal app={viewApp} onClose={() => setViewApp(null)} />
    </div>
  );
}

function StudentSettings() {
  return (
    <Card className="max-w-lg p-6 space-y-5">
      <h2 className="text-base font-semibold text-slate-900">Settings</h2>
      {[
        { label: "Email notifications", desc: "Get notified when your application status changes" },
        { label: "SMS alerts", desc: "Receive an SMS when a certificate is ready for pickup" },
      ].map((s, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
          <div>
            <p className="text-sm font-medium text-slate-800">{s.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
          </div>
          <button className="relative h-6 w-11 rounded-full bg-blue-600">
            <span className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-white shadow" />
          </button>
        </div>
      ))}
      <div>
        <p className="text-sm font-medium text-slate-800 mb-2">Change Password</p>
        <div className="space-y-3">
          <PasswordInput placeholder="Current password" />
          <PasswordInput placeholder="New password" />
        </div>
        <Button className="mt-3">Update Password</Button>
      </div>
    </Card>
  );
}

function StudentProfile() {
  const rows = [
    ["Student Name", "Aravind Kumar"], ["Registration Number", "9520221CS042"], ["Roll Number", "42"],
    ["Batch", "2023 - 2027"], ["Department", "Computer Science and Engineering"], ["Section", "A"],
    ["Year", "III"], ["Quota", "Government Quota"], ["Tutor Name", "Dr. S. Kumaresan"],
    ["Phone", "+91 98765 43210"], ["Email", "aravind.cs23@psnacet.edu.in"],
  ];
  return (
    <Card className="max-w-2xl p-6 sm:p-7">
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
        <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">AK</div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Aravind Kumar</h2>
          <p className="text-sm text-slate-500">Computer Science and Engineering · III Year</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-6 text-sm">
        {rows.map(([k, v]) => (
          <div key={k}><p className="text-slate-400 text-xs">{k}</p><p className="font-medium text-slate-800 mt-0.5">{v}</p></div>
        ))}
      </div>
      <Button variant="secondary" className="mt-6">Edit Profile</Button>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Staff dashboards (Tutor / HOD / Office Staff / DRSS)                 */
/* ------------------------------------------------------------------ */

function ApplicationsTable({ apps, columns, actions, onView }) {
  const [q, setQ] = useState("");
  const filtered = apps.filter((a) => (a.student + a.reg + a.reqNo).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by student, reg no. or request no." className={cx(inputCls, "pl-10")} />
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              {columns.map((c) => <th key={c} className="px-5 py-3 font-medium whitespace-nowrap">{c}</th>)}
              <th className="px-5 py-3 font-medium text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{a.reqNo}</td>
                <td className="px-5 py-3.5 font-medium text-slate-800 whitespace-nowrap">{a.student}</td>
                <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{a.reg}</td>
                {columns.includes("Department") && <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{a.dept}</td>}
                {columns.includes("Year") && <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{a.year}</td>}
                <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{a.cert}</td>
                {columns.includes("Contact Number") && <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{a.contact}</td>}
                {columns.includes("Issue Date") && <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{a.issue || "—"}</td>}
                {columns.includes("Return Date") && <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{a.ret || "—"}</td>}
                {columns.includes("Applied Date") && <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{a.applied}</td>}
                <td className="px-5 py-3.5"><Badge status={a.status} /></td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <div className="inline-flex gap-1.5">
                    {actions.map((act) => (
                      <button key={act.label} onClick={() => act.onClick(a)} title={act.label} className={cx(
                        "rounded-lg px-2.5 py-1.5 text-xs font-medium border transition",
                        act.tone === "success" ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50" :
                        act.tone === "danger" ? "border-red-200 text-red-600 hover:bg-red-50" :
                        "border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}>{act.label}</button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={columns.length + 1} className="px-5 py-10 text-center text-slate-400">No matching applications.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function TutorDashboard({ apps, act }) {
  const pending = apps.filter((a) => a.status === "Pending").length;
  const approved = apps.filter((a) => STATUS_META[a.status].step >= 1 && a.status !== "Rejected").length;
  const rejected = apps.filter((a) => a.status === "Rejected").length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Pending Requests" value={pending} icon={Clock} tone="amber" />
        <StatCard label="Approved Requests" value={approved} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Rejected Requests" value={rejected} icon={XCircle} tone="red" />
      </div>
      <ApplicationsTable apps={apps} columns={["Request No.", "Student Name", "Registration No.", "Certificate Type", "Applied Date"]}
        actions={[
          { label: "View", onClick: (a) => act.view(a) },
          { label: "Approve", tone: "success", onClick: (a) => act.confirm(a, "Tutor Approved", "Approve this request?") },
          { label: "Reject", tone: "danger", onClick: (a) => act.confirm(a, "Rejected", "Reject this request?") },
          { label: "Forward", onClick: (a) => act.confirm(a, "HOD Approved", "Forward this request to HOD?") },
        ]} />
    </div>
  );
}

function HodDashboard({ apps, act }) {
  const total = apps.length;
  const pending = apps.filter((a) => a.status === "Pending" || a.status === "Tutor Approved").length;
  const approved = apps.filter((a) => STATUS_META[a.status].step >= 2 && a.status !== "Rejected").length;
  const rejected = apps.filter((a) => a.status === "Rejected").length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={total} icon={ClipboardList} tone="blue" />
        <StatCard label="Pending" value={pending} icon={Clock} tone="amber" />
        <StatCard label="Approved" value={approved} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Rejected" value={rejected} icon={XCircle} tone="red" />
      </div>
      <ApplicationsTable apps={apps} columns={["Request No.", "Student Name", "Registration No.", "Department", "Certificate Type"]}
        actions={[
          { label: "View", onClick: (a) => act.view(a) },
          { label: "Approve", tone: "success", onClick: (a) => act.confirm(a, "HOD Approved", "Approve this request?") },
          { label: "Reject", tone: "danger", onClick: (a) => act.confirm(a, "Rejected", "Reject this request?") },
          { label: "Forward", onClick: (a) => act.confirm(a, "With Office Staff", "Forward to Office Staff?") },
        ]} />
    </div>
  );
}

function IssueReturnModal({ app, onClose, onSave, onCloseRequest }) {
  const [issue, setIssue] = useState(app?.issue || "");
  const [ret, setRet] = useState(app?.ret || "");
  if (!app) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{app.cert}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{app.reqNo} · {app.student}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Issue Date">
            <div className="relative"><Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="date" value={issue} onChange={(e) => setIssue(e.target.value)} className={cx(inputCls, "pl-10")} />
            </div>
          </Field>
          <Field label="Return Date">
            <div className="relative"><Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="date" value={ret} onChange={(e) => setRet(e.target.value)} className={cx(inputCls, "pl-10")} />
            </div>
          </Field>
          <p className="text-xs text-slate-400">The application stays open until the original certificate is returned by the student.</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => onSave(app, issue, ret, "Issued")}>Save</Button>
          <Button variant="success" onClick={() => onSave(app, issue, ret, "With Office Staff")}>Approve</Button>
          <Button variant="danger" onClick={() => onSave(app, issue, ret, "Rejected")}>Reject</Button>
          <Button onClick={() => onSave(app, issue, ret, "Issued")}>Forward to DRSS</Button>
        </div>
        {app.status === "Issued" && ret && (
          <Button variant="secondary" className="w-full mt-2" onClick={() => onCloseRequest(app)}>
            <RotateCcw className="h-4 w-4" /> Close Request (certificate returned)
          </Button>
        )}
      </div>
    </div>
  );
}

function OsDashboard({ apps, act, onSaveIssueReturn, onCloseRequest }) {
  const [editApp, setEditApp] = useState(null);
  const pending = apps.filter((a) => a.status === "With Office Staff").length;
  const completed = apps.filter((a) => a.status === "Closed" || a.status === "Completed").length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Pending Requests" value={pending} icon={Clock} tone="amber" />
        <StatCard label="Completed Requests" value={completed} icon={CheckCircle2} tone="emerald" />
      </div>
      <ApplicationsTable apps={apps} columns={["Request No.", "Student Name", "Registration No.", "Certificate Type", "Applied Date"]}
        actions={[{ label: "View", onClick: (a) => setEditApp(a) }]} />
      <IssueReturnModal app={editApp} onClose={() => setEditApp(null)}
        onSave={(a, issue, ret, status) => { onSaveIssueReturn(a, issue, ret, status); setEditApp(null); }}
        onCloseRequest={(a) => { onCloseRequest(a); setEditApp(null); }} />
    </div>
  );
}

function DrssDashboard({ apps, act, navigate, setReportApp }) {
  const total = apps.length;
  const pending = apps.filter((a) => !["Closed", "Completed", "Rejected"].includes(a.status)).length;
  const approved = apps.filter((a) => STATUS_META[a.status].step >= 3 && a.status !== "Rejected").length;
  const completed = apps.filter((a) => a.status === "Completed" || a.status === "Closed").length;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          <StatCard label="Total Requests" value={total} icon={ClipboardList} tone="blue" />
          <StatCard label="Pending" value={pending} icon={Clock} tone="amber" />
          <StatCard label="Approved" value={approved} icon={CheckCircle2} tone="indigo" />
          <StatCard label="Completed" value={completed} icon={Award} tone="emerald" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => navigate("report")}><Printer className="h-4 w-4" /> Generate Report</Button>
      </div>
      <ApplicationsTable apps={apps} columns={["Request No.", "Student Name", "Registration No.", "Department", "Year", "Certificate Type", "Contact Number", "Issue Date", "Return Date"]}
        actions={[
          { label: "View", onClick: (a) => act.view(a) },
          { label: "Approve", tone: "success", onClick: (a) => act.confirm(a, "Completed", "Approve this request?") },
          { label: "Reject", tone: "danger", onClick: (a) => act.confirm(a, "Rejected", "Reject this request?") },
          { label: "Generate", onClick: (a) => { setReportApp(a); navigate("report"); } },
        ]} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Report page                                                          */
/* ------------------------------------------------------------------ */

function ReportPage({ app, navigate }) {
  const a = app || INITIAL_APPS[4];
  const rows = [
    ["Student Name", a.student], ["Registration Number", a.reg], ["Department", a.dept], ["Year", a.year],
    ["Certificate Name", a.cert], ["Request Number", a.reqNo], ["Contact Number", a.contact],
    ["Issue Date", a.issue || "—"], ["Return Date", a.ret || "—"], ["Status", a.status],
  ];
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <button onClick={() => navigate("drss-dashboard")} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print Report</Button>
            <Button onClick={() => window.print()}><Download className="h-4 w-4" /> Download PDF</Button>
          </div>
        </div>

        <Card className="p-8 print:border-0 print:shadow-none">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <Logo />
            <div>
              <p className="text-sm font-semibold text-slate-900">PSNA College of Engineering and Technology</p>
              <p className="text-xs text-slate-500">Smart Student Service Portal · Certificate Request Report</p>
            </div>
          </div>

          <h2 className="mt-6 text-base font-semibold text-slate-900">Application Summary</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {rows.map(([k, v]) => (
              <div key={k}><p className="text-slate-400 text-xs">{k}</p><p className="font-medium text-slate-800 mt-0.5">{k === "Status" ? <Badge status={v} /> : v}</p></div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Generated on {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>
            <span>DRSS Office · PSNA CET</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root app                                                             */
/* ------------------------------------------------------------------ */

const staffMeta = {
  tutor: { label: "Tutor", nav: [{ key: "dashboard", label: "Dashboard", icon: LayoutDashboard }], name: "Dr. S. Kumaresan" },
  hod: { label: "Head of Department", nav: [{ key: "dashboard", label: "Dashboard", icon: LayoutDashboard }], name: "Dr. R. Meenakshi" },
  os: { label: "Office Staff", nav: [{ key: "dashboard", label: "Dashboard", icon: LayoutDashboard }], name: "Mr. P. Suresh" },
  drss: { label: "DRSS", nav: [{ key: "dashboard", label: "Dashboard", icon: LayoutDashboard }, { key: "report", label: "Reports", icon: FileText }], name: "Mrs. K. Latha" },
};

export default function App() {
  const [view, setView] = useState("landing");
  const [staffRole, setStaffRole] = useState(null);
  const [studentView, setStudentView] = useState("dashboard");
  const [apps, setApps] = useState(INITIAL_APPS);
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const [viewApp, setViewApp] = useState(null);
  const [reportApp, setReportApp] = useState(null);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  const navigate = (v) => { setView(v); window.scrollTo(0, 0); };

  const updateStatus = (app, status) => {
    setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, status } : a)));
    addToast(`${app.reqNo} updated to "${status}"`, status === "Rejected" ? "error" : "success");
  };

  const act = {
    view: (a) => setViewApp(a),
    confirm: (a, status, message) => setConfirmState({ app: a, status, message }),
  };

  /* ---------------- routing ---------------- */

  if (view === "landing") return <Landing navigate={navigate} />;

  if (view === "student-login") return <StudentLogin navigate={navigate} onLogin={() => { navigate("student-dashboard"); setStudentView("dashboard"); addToast("Welcome back, Aravind!"); }} />;
  if (view === "student-signup") return <StudentSignup navigate={navigate} onSignup={() => { navigate("student-dashboard"); setStudentView("dashboard"); addToast("Account created successfully!"); }} />;
  if (view === "staff-login") return <StaffLogin navigate={navigate} onLogin={(role) => { setStaffRole(role); navigate("staff-dashboard"); addToast(`Signed in as ${staffMeta[role].label}`); }} />;

  if (view === "report") return <ReportPage app={reportApp} navigate={navigate} />;

  if (view === "student-dashboard") {
    const titles = { dashboard: "Dashboard", apply: "Apply Certificate", myapps: "My Applications", settings: "Settings", profile: "Profile" };
    return (
      <>
        <DashboardShell title={titles[studentView]} roleLabel="Student Portal" userName="Aravind Kumar"
          navItems={studentNav} active={studentView} onSelect={setStudentView} onLogout={() => navigate("landing")}>
          {studentView === "dashboard" && <StudentOverview apps={apps} navigate={setStudentView} onQuickApply={() => setStudentView("apply")} />}
          {studentView === "apply" && <ApplyCertificate onCancel={() => setStudentView("dashboard")} onSubmit={() => { setStudentView("myapps"); addToast("Certificate request submitted!"); }} />}
          {studentView === "myapps" && <MyApplications apps={apps} />}
          {studentView === "settings" && <StudentSettings />}
          {studentView === "profile" && <StudentProfile />}
        </DashboardShell>
        <ToastStack toasts={toasts} />
      </>
    );
  }

  if (view === "staff-dashboard" && staffRole) {
    const meta = staffMeta[staffRole];
    const titles = { tutor: "Tutor Dashboard", hod: "HOD Dashboard", os: "Office Staff Dashboard", drss: "DRSS Dashboard" };
    return (
      <>
        <DashboardShell title={titles[staffRole]} roleLabel={meta.label} userName={meta.name}
          navItems={meta.nav} active="dashboard" onSelect={(k) => { if (k === "report") navigate("report"); }} onLogout={() => navigate("landing")}>
          {staffRole === "tutor" && <TutorDashboard apps={apps} act={act} />}
          {staffRole === "hod" && <HodDashboard apps={apps} act={act} />}
          {staffRole === "os" && <OsDashboard apps={apps} act={act}
            onSaveIssueReturn={(a, issue, ret, status) => { setApps((prev) => prev.map((x) => x.id === a.id ? { ...x, issue, ret, status } : x)); addToast(`${a.reqNo} saved`); }}
            onCloseRequest={(a) => { setApps((prev) => prev.map((x) => x.id === a.id ? { ...x, status: "Closed" } : x)); addToast(`${a.reqNo} closed — certificate returned`); }} />}
          {staffRole === "drss" && <DrssDashboard apps={apps} act={act} navigate={navigate} setReportApp={setReportApp} />}
        </DashboardShell>
        <ApplicationDetailModal app={viewApp} onClose={() => setViewApp(null)} />
        <ConfirmDialog open={!!confirmState} title="Confirm action" message={confirmState?.message}
          tone={confirmState?.status === "Rejected" ? "danger" : "primary"}
          onCancel={() => setConfirmState(null)}
          onConfirm={() => { updateStatus(confirmState.app, confirmState.status); setConfirmState(null); }} />
        <ToastStack toasts={toasts} />
      </>
    );
  }

  return <Landing navigate={navigate} />;
}
