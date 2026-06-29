import { CheckCircle, Flame, Hourglass, Target} from 'lucide-react'
import React from 'react'

export default function SummaryCards({ consumedCalories, remainingCalories , dailyGoal }) {
    
    return <>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 '>
            <div className='p-3 border border-emerald-500/20 bg-linear-to-r from-emerald-500/10 to-emerald-600/10 shadow-xl rounded-3xl'>
                <div className='flex items-center justify-between '>
                    <div>
                        <p className='text-emerald-300 text-sm font-medium tracking-wide'>Today's Calories</p>

                        <p className='text-4xl font-bold text-emerald-400 mt-2'>{consumedCalories} Kcal</p>
                    </div>
                    <div className='p-4 bg-emerald-500/20 rounded-2xl'>
                        <Flame className='w-8 h-8 text-emerald-400' />
                    </div>
                </div>
            </div>
            <div className='p-3 border border-purple-500/20 bg-linear-to-r from-purple-500/10 to-purple-600/10 shadow-xl rounded-3xl'>
                <div className='flex items-center justify-between '>
                    <div>
                        <p className='text-purple-300 text-sm font-medium tracking-wide'>Daily Goal</p>

                        <p className='text-4xl font-bold text-purple-400 mt-2 hidden'>{dailyGoal} Kcal</p>
                    </div>
                    <div className='p-4 bg-purple-500/20 rounded-2xl'>
                        <Target className='w-8 h-8 text-purple-400' />
                    </div>
                </div>
            </div>
            <div className={`bg-linear-to-r ${remainingCalories >= 0 ? "from-emerald-500/10 to-emerald-600/10 border-emerald-500/20" : "from-orange-500/10 to-orange-600/10 border-orange-500/20"} backdrop-blur-sm rounded-3xl p-3 border shadow-xl`}>
                <div className={`flex items-center justify-between `}>
                    <div>
                        <p className={`${remainingCalories >= 0 ? " text-emerald-300" : "text-red-300"} text-sm font-medium tracking-wide`}>Remaining Calories</p>

                        <p className={`${remainingCalories >= 0 ? "text-emerald-400" : "text-red-400"} text-4xl font-bold mt-2`}>{Math.abs(remainingCalories)} Kcal</p>
                    </div>
                    <div className={`p-4 shadow-3xl rounded-2xl ${remainingCalories >= 0 ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                        {
                            remainingCalories < 0 ? <Hourglass className={`w-8 h-8 text-red-400`} /> : <CheckCircle className={`w-8 h-8 text-emerald-400`} />
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
}
