import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    User2,
    Weight,
    Ruler,
    Calendar,
    Activity,
    Clock,
    Flame,
    Edit,
    RotateCcw,
    Trash2,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Dumbbell,
    ArrowLeft
} from 'lucide-react'

export default function ProfilePage({ setFormData, setIsEditGoal }) {
    const navigate = useNavigate()
    const [showConfirm, setShowConfirm] = useState(false)

    const userProfile = JSON.parse(localStorage.getItem("profileResult")) || {}
    const transactions = JSON.parse(localStorage.getItem("transactions")) || []

    const today = new Date().toISOString().split("T")[0]
    const todayCalories = transactions
        .filter((trans) => trans.date === today)
        .reduce((sum, trans) => sum + Number(trans.amount || 0), 0)

    const dailyGoal = userProfile?.dailyGoal || 0
    const remainingCalories = dailyGoal - todayCalories
    const caloriePercentage = dailyGoal > 0 ? Math.min((todayCalories / dailyGoal) * 100, 100) : 0

    const handleResetProgress = () => {
        const updatedTransactions = transactions.filter(trans => trans.date !== today)
        localStorage.setItem("transactions", JSON.stringify(updatedTransactions))
        window.location.reload()
    }

    const handleResetEverything = () => {
        localStorage.clear()
        setFormData({
            currentWeight: '',
            targetWeight: '',
            height: '',
            age: '',
            gender: 'male',
            activityLevel: 'sedentary',
            targetDuration: '',
            durationUnit: 'weeks',
        });
        setShowConfirm(false)
        navigate('/')

    }

    const getGenderIcon = () => {
        const gender = userProfile?.gender?.toLowerCase()
        if (gender === 'male' || gender === 'm') {
            return <User2 className="w-16 h-16 text-blue-400" />
        } else if (gender === 'female' || gender === 'f') {
            return <User2 className="w-16 h-16 text-pink-400" />
        }
        return <User2 className="w-16 h-16 text-emerald-400" />
    }

    const getGoalStatus = () => {
        if (remainingCalories >= 0) {
            if (remainingCalories === 0) {
                return {
                    icon: CheckCircle,
                    text: "Goal Reached Today",
                    color: "text-emerald-400",
                    bgColor: "bg-emerald-500/10"
                }
            }
            return {
                icon: TrendingUp,
                text: `${Math.round(remainingCalories)} Calories Remaining`,
                color: "text-blue-400",
                bgColor: "bg-blue-500/10"
            }
        }
        return {
            icon: AlertCircle,
            text: `${Math.round(Math.abs(remainingCalories))} Calories Over Goal`,
            color: "text-red-400",
            bgColor: "bg-red-500/10"
        }
    }

    const goalStatus = getGoalStatus()
    const GoalStatusIcon = goalStatus.icon

    const getProgressBarColor = () => {
        if (caloriePercentage <= 100) return 'bg-emerald-500'
        return 'bg-red-500'
    }

    const editGoal = () => {
        setFormData({
            currentWeight: userProfile.currentWeight,
            targetWeight: userProfile.targetWeight,
            height: userProfile.height,
            age: userProfile.age,
            gender: userProfile.gender,
            activityLevel: userProfile.activityLevel,
            targetDuration: userProfile.targetDuration,
            durationUnit: userProfile.durationUnit,
        })
        navigate('/')
        setIsEditGoal(true)
    }


    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    return (
        <div className="min-h-screen relative bg-linear-to-br from-zinc-950 via-slate-900 to-emerald-950 p-4 sm:p-6 lg:p-8">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-all duration-300 cursor-pointer mb-2 hover:scale-105">
                <ArrowLeft className="w-5 h-5 " />
                <span>Dashboard</span>
            </button>
            {/* Header Section */}
            <div className="max-w-2xl mx-auto mb-8">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-6 bg-linear-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl">
                            {getGenderIcon()}
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">GainFlow Member</h1>
                    <p className="text-emerald-400 text-lg font-semibold">
                        Daily Goal: <span className="text-white">{dailyGoal?.toLocaleString() || 'N/A'} kcal</span>
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-2xl mx-auto space-y-6">
                {/* User Information Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Dumbbell className="w-6 h-6 text-emerald-400" />
                        Fitness Profile
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Current Weight */}
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
                            <div className="p-3 bg-emerald-500/20 rounded-xl">
                                <Weight className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Current Weight</p>
                                <p className="text-xl font-bold text-white">{userProfile?.currentWeight || 'N/A'} kg</p>
                            </div>
                        </div>

                        {/* Target Weight */}
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Target Weight</p>
                                <p className="text-xl font-bold text-white">{userProfile?.targetWeight || 'N/A'} kg</p>
                            </div>
                        </div>

                        {/* Height */}
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <Ruler className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Height</p>
                                <p className="text-xl font-bold text-white">{userProfile?.height || 'N/A'} cm</p>
                            </div>
                        </div>

                        {/* Age */}
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
                            <div className="p-3 bg-pink-500/20 rounded-xl">
                                <Calendar className="w-5 h-5 text-pink-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Age</p>
                                <p className="text-xl font-bold text-white">{userProfile?.age || 'N/A'} years</p>
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
                            <div className="p-3 bg-indigo-500/20 rounded-xl">
                                <User2 className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Gender</p>
                                <p className="text-xl font-bold text-white">{userProfile?.gender || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Activity Level */}
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
                            <div className="p-3 bg-yellow-500/20 rounded-xl">
                                <Activity className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Activity Level</p>
                                <p className="text-xl font-bold text-white">{userProfile?.activityLevel || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Target Duration */}
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
                            <div className="p-3 bg-cyan-500/20 rounded-xl">
                                <Clock className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Target Duration</p>
                                <p className="text-xl font-bold text-white">{userProfile?.targetDuration || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Daily Calorie Goal */}
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
                            <div className="p-3 bg-red-500/20 rounded-xl">
                                <Flame className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Daily Goal</p>
                                <p className="text-xl font-bold text-white">{dailyGoal?.toLocaleString() || 'N/A'} kcal</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Flame className="w-6 h-6 text-emerald-400" />
                        Today's Progress
                    </h2>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-slate-300">Calorie Intake</p>
                            <p className="text-white font-bold">
                                {todayCalories.toLocaleString()} / {dailyGoal?.toLocaleString() || '0'} kcal
                            </p>
                        </div>

                        <div className="w-full bg-white/10 rounded-full h-3 border border-white/20 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor()}`}
                                style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
                            />
                        </div>

                        <p className="text-right text-emerald-400 font-semibold">
                            {Math.round(caloriePercentage)}%
                        </p>
                    </div>
                </div>

                {/* Goal Status Card */}
                <div className={`backdrop-blur-xl border border-white/10 rounded-3xl p-8 ${goalStatus.bgColor}`}>
                    <div className="flex items-center justify-center gap-3">
                        <GoalStatusIcon className={`w-8 h-8 ${goalStatus.color}`} />
                        <p className={`text-xl font-bold ${goalStatus.color}`}>
                            {goalStatus.text}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={editGoal}
                        className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        <Edit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Edit Goal
                    </button>

                    <button
                        onClick={handleResetProgress}
                        className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform" />
                        Reset Today's Progress
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="w-full bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Reset Everything
                        </button>

                        {showConfirm && (
                            <div className=" top-0 mt-2 w-full backdrop-blur-xl bg-red-950/90 border border-red-500/50 rounded-2xl p-4 z-10">
                                <p className="text-white text-sm font-semibold mb-3">
                                    This will clear all data. Continue?
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleResetEverything}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 text-sm"
                                    >
                                        Yes, Clear All
                                    </button>
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
