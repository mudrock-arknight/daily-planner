import { useState, useEffect } from 'react';
import { Calendar, Target, CheckCircle2, AlertCircle, BookOpen, Brain, GraduationCap, Coffee } from 'lucide-react';
import { supabase } from '../lib/supabase';
const themeColors: Record<string, {
 bg: string;
 text: string;
 border: string;
 gradient: string;
}> = {
 blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' },
 red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', gradient: 'from-red-500 to-red-600' },
 green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', gradient: 'from-green-500 to-green-600' },
 orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', gradient: 'from-orange-500 to-orange-600' },
 purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', gradient: 'from-purple-500 to-purple-600' },
 teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', gradient: 'from-teal-500 to-teal-600' },
 pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', gradient: 'from-pink-500 to-pink-600' },
};
const typeIcons = {
 class: BookOpen,
 study: Brain,
 exam: GraduationCap,
 break: Coffee,
 task: Target,
};
export default function WeeklyPlanPage() {
 const [weeklyPlan, setWeeklyPlan] = useState<any>(null);
 const [selectedDay, setSelectedDay] = useState<string>('');
 const [expandedDay, setExpandedDay] = useState<string | null>(null);
 useEffect(() => {
 loadWeeklyPlan();
 }, []);
 async function loadWeeklyPlan() {
 const { data } = await supabase
 .from('weekly_plans')
 .select('*')
 .order('created_at', { ascending: false })
 .limit(1);
 if (data && data.length > 0) {
 setWeeklyPlan(data[0]);
 if (data[0].data?.dailySchedule) {
 const days = Object.keys(data[0].data.dailySchedule);
 if (days.length > 0) {
 setSelectedDay(days[0]);
 }
 }
 }
 }
 const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
 const totalEnglishHours = weeklyPlan?.data?.weeklyReview?.totalEnglishHours || 0;
 const targetHours = weeklyPlan?.data?.weeklyReview?.targetHours || 100;
 const progress = Math.round((totalEnglishHours / targetHours) * 100);
 return (<div className="p-4 max-w-4xl mx-auto pb-32">
 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
 <div className="flex items-center justify-between mb-4">
 <div>
 <div className="text-white/80 text-sm mb-1">第 {weeklyPlan?.week?.replace('第', '').replace('周', '')} 周</div>
 <div className="text-2xl font-bold">本周学习计划</div>
 </div>
 <Calendar size={40} className="text-white/80"/>
 </div>
 <div className="flex items-center gap-6">
 <div>
 <div className="text-white/60 text-sm">英语目标进度</div>
 <div className="text-2xl font-bold">{totalEnglishHours}/{targetHours}h</div>
 </div>
 <div className="flex-1">
 <div className="h-2 bg-white/30 rounded-full overflow-hidden">
 <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }}/>
 </div>
 </div>
 </div>
 </div>

 {weeklyPlan?.data?.goals && (<div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
 <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
 <Target className="text-purple-500" size={20}/>
 本周目标
 </h2>
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
 {weeklyPlan.data.goals.map((goal: any) => (<div key={goal.id} className={`p-4 rounded-xl ${goal.type === 'exam' ? 'bg-red-50 border border-red-100' :
 goal.type === 'study' ? 'bg-green-50 border border-green-100' :
 'bg-blue-50 border border-blue-100'}`}>
 <div className="flex items-center justify-between mb-2">
 <span className="font-medium text-gray-800 text-sm">{goal.text}</span>
 {goal.type === 'exam' && (<span className="text-xs bg-red-200 text-red-700 px-2 py-0.5 rounded">考试</span>)}
 {goal.type === 'study' && (<span className="text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded">学习</span>)}
 </div>
 {goal.progress !== undefined && (<div>
 <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
 <div className={`h-full rounded-full transition-all ${goal.type === 'exam' ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${goal.progress}%` }}/>
 </div>
 </div>)}
 {goal.deadline && (<div className="text-xs text-gray-500 mt-2">截止: {goal.deadline}</div>)}
 </div>))}
 </div>
 </div>)}

 <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
 <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
 <Calendar className="text-blue-500" size={20}/>
 每日概览
 </h2>
 <div className="grid grid-cols-7 gap-2">
 {dayNames.map((day) => {
 const schedule = weeklyPlan?.data?.dailySchedule?.[day];
 const theme = schedule?.themeColor ? themeColors[schedule.themeColor] : themeColors.blue;
 return (<button key={day} onClick={() => {
 setSelectedDay(day);
 setExpandedDay(expandedDay === day ? null : day);
 }} className={`relative p-3 rounded-xl text-center transition-all ${expandedDay === day ? `${theme.bg} ${theme.text} ring-2 ring-offset-1` : 'bg-gray-50 hover:bg-gray-100'}`}>
 <div className="font-medium text-sm">{day}</div>
 {schedule && (<>
 <div className={`text-xs mt-1 ${expandedDay === day ? 'font-medium' : 'text-gray-500'}`}>
 {schedule.date}
 </div>
 <div className={`text-xs mt-1 ${expandedDay === day ? 'font-medium' : 'text-gray-400'}`}>
 {schedule.englishTarget}h
 </div>
 </>)}
 </button>);
 })}
 </div>
 </div>

 {selectedDay && weeklyPlan?.data?.dailySchedule?.[selectedDay] && (<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
 <div className="flex items-center justify-between">
 <div>
 <div className="text-white/80 text-sm">{selectedDay}</div>
 <div className="text-xl font-bold">
 {weeklyPlan.data.dailySchedule[selectedDay].date}
 </div>
 </div>
 <div className="flex items-center gap-2">
 <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
 {weeklyPlan.data.dailySchedule[selectedDay].theme}
 </span>
 </div>
 </div>
 <div className="mt-3 flex items-center gap-4">
 <span className="text-white/80 text-sm">
 英语目标: {weeklyPlan.data.dailySchedule[selectedDay].englishTarget}h
 </span>
 <span className="text-white/60">|</span>
 <span className="text-white/80 text-sm">
 重点: {weeklyPlan.data.dailySchedule[selectedDay].focusGoal}
 </span>
 </div>
 </div>

 <div className="p-4">
 <div className="space-y-2">
 {weeklyPlan.data.dailySchedule[selectedDay].timeBlocks.map((block: any, i: number) => {
 const Icon = typeIcons[block.type as keyof typeof typeIcons] || Target;
 return (<div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${block.type === 'class' ? 'bg-blue-50' :
 block.type === 'study' ? 'bg-green-50' :
 block.type === 'exam' ? 'bg-red-50' :
 block.type === 'break' ? 'bg-yellow-50' :
 'bg-purple-50'}`}>
 <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${block.type === 'class' ? 'bg-blue-100 text-blue-600' :
 block.type === 'study' ? 'bg-green-100 text-green-600' :
 block.type === 'exam' ? 'bg-red-100 text-red-600' :
 block.type === 'break' ? 'bg-yellow-100 text-yellow-600' :
 'bg-purple-100 text-purple-600'}`}>
 <Icon size={12}/>
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-2">
 <span className="text-sm font-medium text-gray-800">{block.time}</span>
 </div>
 <div className="text-gray-700">{block.content}</div>
 {block.detail && (<div className="text-sm text-gray-500 mt-1">{block.detail}</div>)}
 {block.location && (<div className="text-xs text-gray-400 mt-1">📍 {block.location}</div>)}
 </div>
 </div>);
 })}
 </div>
 </div>
 </div>)}

 {weeklyPlan?.data?.notes && (<div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-200">
 <h2 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
 <AlertCircle className="text-yellow-600" size={20}/>
 重要提醒
 </h2>
 <ul className="space-y-2">
 {weeklyPlan.data.notes.map((note: string, i: number) => (<li key={i} className="flex items-center gap-2 text-yellow-700">
 <CheckCircle2 className="text-yellow-600" size={16}/>
 {note}
 </li>))}
 </ul>
 </div>)}

 {weeklyPlan?.data?.weeklyReview && (<div className="mt-6 space-y-4">
 <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
 <h3 className="font-semibold text-gray-800 mb-3">上周总结</h3>
 <p className="text-gray-600">{weeklyPlan.data.weeklyReview.lastWeekSummary}</p>
 </div>
 <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
 <h3 className="font-semibold text-gray-800 mb-3">本周重点</h3>
 <p className="text-gray-600">{weeklyPlan.data.weeklyReview.thisWeekFocus}</p>
 </div>
 <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
 <h3 className="font-semibold text-gray-800 mb-3">下周计划</h3>
 <p className="text-gray-600">{weeklyPlan.data.weeklyReview.nextWeekGoals}</p>
 </div>
 </div>)}

 {!weeklyPlan && (<div className="text-center py-12">
 <AlertCircle size={48} className="mx-auto text-gray-300 mb-4"/>
 <h3 className="text-gray-500 font-medium mb-2">暂无周计划</h3>
 <p className="text-gray-400 text-sm">请添加周计划以查看详细安排</p>
 </div>)}
 </div>);
}

