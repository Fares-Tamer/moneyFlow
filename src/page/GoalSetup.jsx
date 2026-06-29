import React, { useEffect, useMemo, useState } from 'react'
import { Activity, CalendarDays, ChevronRight, User, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function FormField({ label, htmlFor, children, error }) {
    return (
        <div className="space-y-2">
            <label htmlFor={htmlFor} className="block text-sm font-semibold text-zinc-200">
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-rose-300">{error}</p>}
        </div>
    )
}

function RadioGroup({ label, name, options, value, onChange, error }) {
    return (
        <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-200">{label}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange({ target: { name, value: option.value } })}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ${value === option.value
                            ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100 shadow-sm'
                            : 'border-zinc-700 bg-white/5 text-zinc-300 hover:border-emerald-300 hover:bg-emerald-300/10'
                            }`}
                    >
                        <span className="block font-medium">{option.label}</span>
                        {option.description && <span className="text-xs text-zinc-400">{option.description}</span>}
                    </button>
                ))}
            </div>
            {error && <p className="text-xs text-rose-300">{error}</p>}
        </div>
    )
}

export default function GoalSetup({ formData, setFormData, isEditGoal, setIsEditGoal }) {

    const navigate = useNavigate()
    const [touched, setTouched] = useState({})
    const [submitAttempted, setSubmitAttempted] = useState(false)

    const errors = useMemo(() => {
        return {
            currentWeight: !formData.currentWeight ? 'Current weight is required.' : '',
            targetWeight: !formData.targetWeight ? 'Target weight is required.' : '',
            height: !formData.height ? 'Height is required.' : '',
            age: !formData.age ? 'Age is required.' : '',
            gender: !formData.gender ? 'Please select your gender.' : '',
            activityLevel: !formData.activityLevel ? 'Please choose an activity level.' : '',
            targetDuration: !formData.targetDuration ? 'Duration is required.' : '',
        }
    }, [formData])

    const hasErrors = Object.values(errors).some(Boolean)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleBlur = (event) => {
        const { name } = event.target
        setTouched((prev) => ({ ...prev, [name]: true }))
    }

    const calculateDailyGoal = (data) => {
        // Convert string values to numbers
        const currentWeight = Number(data.currentWeight);
        const targetWeight = Number(data.targetWeight);
        const height = Number(data.height);
        const age = Number(data.age);
        const targetDuration = Number(data.targetDuration);

        // 1) Calculate BMR (Mifflin-St Jeor Equation)
        let bmr;

        if (data.gender === "male") {
            bmr = (10 * currentWeight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * currentWeight) + (6.25 * height) - (5 * age) - 161;
        }

        // 2) Activity Factors
        const activityFactors = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            veryActive: 1.9,
        };

        const maintenanceCalories =
            bmr * activityFactors[data.activityLevel];

        // 3) Convert duration to days
        const days =
            data.durationUnit === "weeks"
                ? targetDuration * 7
                : targetDuration * 30;

        // 4) Calculate required calories
        const weightDifference = targetWeight - currentWeight;

        // Every 1 kg ≈ 7700 kcal
        const totalCaloriesNeeded = weightDifference * 7700;

        const dailyAdjustment = totalCaloriesNeeded / days;

        const dailyGoal = Math.round(
            maintenanceCalories + dailyAdjustment
        );

        // 5) Save to localStorage
        const goalData = {
            currentWeight,
            targetWeight,
            height,
            age,
            gender: data.gender,
            activityLevel: data.activityLevel,
            targetDuration,
            durationUnit: data.durationUnit,
            bmr: Math.round(bmr),
            maintenanceCalories: Math.round(maintenanceCalories),
            dailyGoal,
        };

        localStorage.setItem("profileResult", JSON.stringify(goalData));

        return goalData;
    };

    const updateGoal = () => {
        const updatedData = {
            ...formData,
            currentWeight: Number(formData.currentWeight),
            targetWeight: Number(formData.targetWeight),
            height: Number(formData.height),
            age: Number(formData.age),
            targetDuration: Number(formData.targetDuration),
        };

        setFormData(updatedData);

        const result = calculateDailyGoal(updatedData);

        localStorage.setItem(
            "profileResult",
            JSON.stringify(result)
        );

        setIsEditGoal(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitAttempted(true);

        if (hasErrors) return;

        const result = calculateDailyGoal(formData);

        if (isEditGoal) {
            setIsEditGoal(false);
        }

        navigate("/dashboard");
    };
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);


    return (
        <div className="min-h-screen bg-linear-to-br from-zinc-950 via-slate-900 to-emerald-950 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.4em] text-emerald-300/80">GainFlow Onboarding</p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            Set your daily calorie goal.
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                            Complete this quick setup to get a personalized calorie target before you start tracking meals.
                        </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-emerald-100 shadow-2xl shadow-black/20 backdrop-blur-xl">
                        <div className="flex items-center gap-3 text-emerald-300">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
                                <CalendarDays size={18} />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">Progress</p>
                                <p className="text-sm font-semibold text-white">Step 1 of 1</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10">
                    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                        <div className="space-y-6">
                            <div className="rounded-3xl border border-emerald-400/10 bg-emerald-500/5 p-5 shadow-inner shadow-black/10">
                                <div className="flex items-center gap-3 text-emerald-100">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-400/10 text-emerald-300">
                                        <Activity size={20} />
                                    </span>
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/80">Your profile</p>
                                        <p className="mt-1 text-lg font-semibold text-white">A clean starting point.</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        label="Current Weight (kg)"
                                        htmlFor="currentWeight"
                                        error={touched.currentWeight || submitAttempted ? errors.currentWeight : ''}
                                    >
                                        <input
                                            id="currentWeight"
                                            name="currentWeight"
                                            value={formData.currentWeight}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="number"
                                            inputMode="decimal"
                                            min="1"
                                            step="0.1"
                                            placeholder="e.g. 72"
                                            className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Target Weight (kg)"
                                        htmlFor="targetWeight"
                                        error={touched.targetWeight || submitAttempted ? errors.targetWeight : ''}
                                    >
                                        <input
                                            id="targetWeight"
                                            name="targetWeight"
                                            value={formData.targetWeight}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="number"
                                            inputMode="decimal"
                                            min="1"
                                            step="0.1"
                                            placeholder="e.g. 68"
                                            className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                        />
                                    </FormField>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        label="Height (cm)"
                                        htmlFor="height"
                                        error={touched.height || submitAttempted ? errors.height : ''}
                                    >
                                        <input
                                            id="height"
                                            name="height"
                                            value={formData.height}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="number"
                                            min="1"
                                            placeholder="e.g. 175"
                                            className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Age"
                                        htmlFor="age"
                                        error={touched.age || submitAttempted ? errors.age : ''}
                                    >
                                        <input
                                            id="age"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="number"
                                            min="10"
                                            placeholder="e.g. 29"
                                            className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                        />
                                    </FormField>
                                </div>

                                <RadioGroup
                                    label="Gender"
                                    name="gender"
                                    options={[
                                        { value: 'male', label: 'Male' },
                                        { value: 'female', label: 'Female' },
                                    ]}
                                    value={formData.gender}
                                    onChange={handleChange}
                                    error={touched.gender || submitAttempted ? errors.gender : ''}
                                />

                                <FormField
                                    label="Activity Level"
                                    htmlFor="activityLevel"
                                    error={touched.activityLevel || submitAttempted ? errors.activityLevel : ''}
                                >
                                    <select
                                        id="activityLevel"
                                        name="activityLevel"
                                        value={formData.activityLevel}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="w-full appearance-none rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                    >
                                        <option value="sedentary">Sedentary</option>
                                        <option value="light">Light</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="active">Active</option>
                                        <option value="very-active">Very Active</option>
                                    </select>
                                </FormField>

                                <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
                                    <FormField
                                        label="Target Duration"
                                        htmlFor="targetDuration"
                                        error={touched.targetDuration || submitAttempted ? errors.targetDuration : ''}
                                    >
                                        <input
                                            id="targetDuration"
                                            name="targetDuration"
                                            value={formData.targetDuration}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="number"
                                            min="1"
                                            placeholder="e.g. 12"
                                            className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                        />
                                    </FormField>

                                    <FormField label="Duration Unit" htmlFor="durationUnit">
                                        <select
                                            id="durationUnit"
                                            name="durationUnit"
                                            value={formData.durationUnit}
                                            onChange={handleChange}
                                            className="w-full appearance-none rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                        >
                                            <option value="weeks">Weeks</option>
                                            <option value="months">Months</option>
                                        </select>
                                    </FormField>
                                </div>

                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center gap-3 rounded-3xl bg-emerald-400 px-6 py-4 text-sm font-semibold text-slate-950 shadow-xl shadow-emerald-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 sm:w-auto"
                                >
                                    Calculate My Daily Goal
                                    <ChevronRight size={18} />
                                </button>
                            </form>
                        </div>

                        <aside className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-zinc-300 shadow-lg shadow-black/20 backdrop-blur-xl">
                            <div className="mb-5 flex items-center gap-3">
                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-400/10 text-emerald-200">
                                    <Users size={20} />
                                </span>
                                <div>
                                    <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/80">Why we ask</p>
                                    <p className="text-lg font-semibold text-white">Better goals, less guesswork.</p>
                                </div>
                            </div>
                            <div className="space-y-4 text-sm leading-6 text-zinc-300">
                                <p className="flex items-start gap-3">
                                    <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
                                        <User size={14} />
                                    </span>
                                    Track your current profile and move toward your goal with clarity.
                                </p>
                                <p className="flex items-start gap-3">
                                    <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
                                        <Activity size={14} />
                                    </span>
                                    Activity level helps tailor your daily target to your lifestyle.
                                </p>
                                <p className="text-sm text-zinc-400">
                                    No calculations are performed here yet — this step only captures the details you need.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    )
}
