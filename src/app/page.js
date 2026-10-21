"use client";
import React, { useState, useEffect } from 'react';
import './globals.css'; 

import { auth, db, logInWithGoogle, logOut } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { sessions, sessionTypes, getSessionUrl, getSessionDisplayTitle, getReducedIntervalWorkout, matchesSessionSearch } from './session-data';
import { calculatePaces, formatTime } from './pace-utils';
import { formatDistanceText } from './distance-format';
import { saveDistanceUnit } from './distance-unit';
import SiteHeader from './site-header';
import Link from 'next/link';

export default function The11thMile() {
    const [timeInput, setTimeInput] = useState("");
    const [unit, setUnit] = useState('miles');
    const [gender, setGender] = useState('male');
    const [activeFilter, setActiveFilter] = useState('all');
    const [sessionSearch, setSessionSearch] = useState('');
    const [isReducedSession, setIsReducedSession] = useState(false);
    const [sortMode, setSortMode] = useState(0);
    const [view, setView] = useState('library');
    const [plan, setPlan] = useState(null);
    const [completedSessions, setCompletedSessions] = useState({});
    
    // Modal states
    const [infoModalSession, setInfoModalSession] = useState(null);
    const [isPlanSetupOpen, setIsPlanSetupOpen] = useState(false);

    useEffect(() => {
        if (!infoModalSession && !isPlanSetupOpen) return;

        const originalBodyOverflow = document.body.style.overflow;
        const originalDocumentOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalDocumentOverflow;
        };
    }, [infoModalSession, isPlanSetupOpen]);

    // Form state 
    const [form, setForm] = useState({
        name: '', age: '', yearsRunning: '', goalType: 'race',
        raceName: '', raceDate: '', distance: '5k', currentVolume: '', volUnit: 'miles', goalTime: '',
        dMon: false, dTue: true, dWed: false, dThu: true, dFri: false, dSat: true, dSun: false 
    });

    // Paces & Loading state
    const [paces, setPaces] = useState(null);
    const [user, setUser] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    // Helpers
    const formatTextForUnit = (text) => {
        return formatDistanceText(text, unit);
    };

    // DB Sync Helper
    const saveProgressToDB = async (updatedPlan, updatedCompleted) => {
        if (!user) return;
        try {
            await setDoc(doc(db, "users", user.uid), {
                plan: updatedPlan !== undefined ? updatedPlan : plan,
                completedSessions: updatedCompleted !== undefined ? updatedCompleted : completedSessions,
                preferences: { unit, gender, time: timeInput }
            }, { merge: true });
        } catch (error) {
            console.error("Error saving to DB:", error);
        }
    };

    // Auto-Scroll to Current Week
    useEffect(() => {
        if (view === 'plan' && plan) {
            const planStart = new Date(plan.planStartDate);
            planStart.setHours(0,0,0,0);
            const today = new Date();
            today.setHours(0,0,0,0);
            const diffTime = today - planStart;
            let currentWeek = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
            
            if (currentWeek < 0) currentWeek = 0;
            if (currentWeek >= plan.totalWeeks) currentWeek = plan.totalWeeks - 1;

            setTimeout(() => {
                const element = document.getElementById(`week-${currentWeek}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [view, plan]);

    // Load from LocalStorage
    useEffect(() => {
        const s = JSON.parse(localStorage.getItem('11thMilePrefs'));
        if(s){ 
            if(s.gender) setGender(s.gender); 
            if(s.unit) setUnit(s.unit); 
            if(s.time) setTimeInput(s.time);
            if(s.plan){ setPlan(s.plan); setView('plan'); }
        }
        const comp = JSON.parse(localStorage.getItem('11thMileCompleted'));
        if(comp) setCompletedSessions(comp);
    }, []);

    // Load from Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.plan) { setPlan(data.plan); setView('plan'); }
                    if (data.completedSessions) setCompletedSessions(data.completedSessions);
                    if (data.preferences) {
                        if (data.preferences.unit) setUnit(data.preferences.unit);
                        if (data.preferences.gender) setGender(data.preferences.gender);
                        if (data.preferences.time) setTimeInput(data.preferences.time);
                    }
                }
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setPaces(timeInput.length >= 4 ? calculatePaces(timeInput, unit, gender) : null);
        
        localStorage.setItem('11thMilePrefs', JSON.stringify({ time: timeInput, gender, unit, plan }));
    }, [timeInput, unit, gender, plan]);

    const handleTimeInput = (e) => {
        let val = e.target.value.replace(/\D/g, ''); 
        if (val.length > 4) val = val.slice(0, 4); 
        if (val.length > 2) val = val.slice(0, 2) + ':' + val.slice(2); 
        setTimeInput(val);
    };

    const openSession = (session) => {
        setInfoModalSession(session);
    };

    const handleGoalTimeInput = (e) => {
        let val = e.target.value.replace(/\D/g, ''); 
        if (val.length > 6) val = val.slice(0, 6); 
        let formatted = val;
        if (val.length > 4) {
            formatted = val.slice(0, 2) + ':' + val.slice(2, 4) + ':' + val.slice(4);
        } else if (val.length > 2) {
            formatted = val.slice(0, 2) + ':' + val.slice(2);
        }
        setForm({...form, goalTime: formatted});
    };

    const toggleSort = () => setSortMode((prev) => (prev + 1) % 3);
    const getSortIcon = () => sortMode === 0 ? "↕" : sortMode === 1 ? "⬆" : "⬇";
    const getSortText = () => sortMode === 0 ? "Sort" : sortMode === 1 ? "Shortest" : "Longest";

    const generatePlan = () => {
        // Validation Checks
        if (!form.currentVolume || parseFloat(form.currentVolume) <= 0) {
            return alert("Please enter a valid current weekly volume (e.g., 10) so we can build your plan safely.");
        }
        
        let daysAvailable = [form.dMon, form.dTue, form.dWed, form.dThu, form.dFri, form.dSat, form.dSun];
        if (daysAvailable.every(d => d === false)) {
            return alert("Please select at least one running day per week.");
        }
        
        if (form.goalType === 'race' && !form.raceDate) {
            return alert("Please select a race date.");
        }

        setIsGenerating(true);
        setIsPlanSetupOpen(false);

        const messages = [
            "Analysing your current weekly mileage...",
            "Evaluating pace and energy systems...",
            "Building your personalised progression...",
            "Optimising your physical preparation..."
        ];

        let messageIndex = 0;
        setLoadingMessage(messages[0]);

        const interval = setInterval(() => {
            messageIndex++;
            if (messageIndex < messages.length) { setLoadingMessage(messages[messageIndex]); }
        }, 1500);

        setTimeout(async () => {
            clearInterval(interval);
            
            let startVolume = parseFloat(form.currentVolume) || 0;
            if(form.volUnit === 'km') startVolume = startVolume * 0.621371;
            
            let runnerLevel = "Beginner";
            if (startVolume >= 40) { runnerLevel = "Elite"; }
            else if (startVolume >= 30) { runnerLevel = "Advanced"; }
            else if (startVolume >= 20) { runnerLevel = "Intermediate"; }

            const today = new Date(); 
            today.setHours(0,0,0,0);
            const dayOfWeek = today.getDay(); 
            const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const planStartDate = new Date(today);
            planStartDate.setDate(today.getDate() + diffToMonday);

            let totalWeeks = 26;
            let finalRaceDate = null;

            if (form.goalType === 'race') {
                const rDate = new Date(form.raceDate);
                const diffDays = Math.ceil((rDate - planStartDate) / (1000 * 60 * 60 * 24));
                totalWeeks = Math.max(1, Math.ceil(diffDays / 7));
                finalRaceDate = form.raceDate;
            }

            let targetPeakVol = form.distance === 'Marathon' ? 45 : form.distance === 'Half Marathon' ? 30 : form.distance === '10k' ? 25 : 20;
            if (startVolume > targetPeakVol) targetPeakVol = startVolume + 5; 
            if (targetPeakVol > 60) targetPeakVol = startVolume > 60 ? startVolume : 60; 

            const weeklyVolumes = [];
            let currentVol = startVolume;

            for (let w = 0; w < totalWeeks; w++) {
                if (form.goalType === 'race') {
                    if (w === totalWeeks - 1) weeklyVolumes.push(targetPeakVol * 0.4); 
                    else if (w === totalWeeks - 2) weeklyVolumes.push(targetPeakVol * 0.7); 
                    else {
                        currentVol = Math.min(startVolume + (w * 2.5), targetPeakVol);
                        weeklyVolumes.push(currentVol);
                    }
                } else if (form.goalType === 'maintain_fitness') {
                    if (w < 4) {
                        const wave = [1.0, 1.05, 1.1, 0.85]; 
                        weeklyVolumes.push(Math.min(startVolume * wave[w % 4], targetPeakVol));
                    } else {
                        let buildWeeks = w - 4;
                        currentVol = Math.min(startVolume + (buildWeeks * 1.5), targetPeakVol);
                        weeklyVolumes.push(currentVol);
                    }
                } else {
                    if (w % 4 === 3 && w > 0) { 
                        weeklyVolumes.push(currentVol * 0.8);
                    } else {
                        currentVol = Math.min(startVolume + (w * 1.5), targetPeakVol);
                        weeklyVolumes.push(currentVol);
                    }
                }
            }

            // FRIDAY REST DAY OVERRIDE
            if (daysAvailable.every(d => d === true)) daysAvailable[4] = false;

            const availableDayIndices = daysAvailable.map((isAvail, idx) => isAvail ? idx : -1).filter(idx => idx !== -1);
            
            const newPlan = { 
                ...form, 
                raceDate: finalRaceDate, 
                startVolume, 
                daysAvailable, 
                ability: runnerLevel,
                totalWeeks,
                weeklyVolumes,
                availableDayIndices,
                planStartDate: planStartDate.toISOString()
            };
            
            setPlan(newPlan);
            setView('plan');
            setIsGenerating(false);

            await saveProgressToDB(newPlan, completedSessions);
        }, 4500);
    };

    const confirmResetPlan = () => {
        if(window.confirm("Reset progress?")) {
            setPlan(null); setCompletedSessions({}); setView('library');
            localStorage.removeItem('11thMileCompleted');
            saveProgressToDB(null, {}); 
        }
    };

    const toggleSessionDone = (dateKey) => {
        const newComp = { ...completedSessions, [dateKey]: !completedSessions[dateKey] };
        setCompletedSessions(newComp);
        localStorage.setItem('11thMileCompleted', JSON.stringify(newComp));
        saveProgressToDB(plan, newComp);
    };

    // Advanced Anchor & Fill Distribution Logic (WITH 3-WORKOUT HIGH VOLUME SPLIT)
    const assignRolesAndSessions = (targetVolume, days, weekNum) => {
        let schedule = {}; 
        let numDays = days.length;
        if (numDays === 0) return schedule;

        const sortedDays = [...days].sort((a,b)=>a-b);
        const lastDay = sortedDays[sortedDays.length - 1];

        let longDay = lastDay;
        let w1Day = -1;
        let w2Day = -1;
        let w3Day = -1;

        if (numDays === 2) {
            w1Day = sortedDays[0];
        } else if (numDays === 3) {
            w1Day = sortedDays.includes(1) ? 1 : sortedDays.includes(2) ? 2 : sortedDays[0];
        } else if (numDays === 4) {
            w1Day = sortedDays.includes(1) ? 1 : sortedDays[0];
            let remainingForW2 = sortedDays.filter(d => d !== longDay && d !== w1Day);
            w2Day = remainingForW2.includes(3) ? 3 : remainingForW2.includes(4) ? 4 : remainingForW2[Math.floor(remainingForW2.length / 2)];
        } else if (numDays >= 5) {
            w1Day = sortedDays.includes(1) ? 1 : sortedDays[0]; // Usually Tuesday
            let remaining = sortedDays.filter(d => d !== longDay && d !== w1Day);
            w2Day = remaining.includes(3) ? 3 : remaining.includes(2) ? 2 : remaining[Math.floor(remaining.length / 2)]; // Usually Thursday
            let remainingForW3 = remaining.filter(d => d !== w2Day);
            w3Day = remainingForW3.includes(5) ? 5 : remainingForW3.includes(4) ? 4 : remainingForW3[remainingForW3.length - 1]; // Usually Saturday
        }
        
        const easyDays = sortedDays.filter(d => d !== longDay && d !== w1Day && d !== w2Day && d !== w3Day);

        const getClosestSession = (targetDist, typeKeys) => {
            let validIds = [];
            typeKeys.forEach(key => { if(sessionTypes[key]) validIds.push(...sessionTypes[key]); });
            let candidates = sessions.filter(s => validIds.includes(s.id));
            if(candidates.length === 0) return sessions[0];
            return candidates.reduce((prev, curr) => Math.abs(curr.distanceVal - targetDist) < Math.abs(prev.distanceVal - targetDist) ? curr : prev);
        };

        let totalAnchored = 0;

        if (longDay !== -1) {
            let targetDist = Math.min(targetVolume * (numDays >= 5 ? 0.30 : 0.35), 20); 
            if(numDays === 1) targetDist = targetVolume;
            let s = getClosestSession(targetDist, ['long_run']);
            schedule[longDay] = s;
            totalAnchored += s.distanceVal;
        }

        if (w1Day !== -1) {
            let targetDist = targetVolume * (numDays >= 5 ? 0.15 : 0.20);
            let cats = [['tempo'], ['long_interval'], ['fartlek']][weekNum % 3];
            let s = getClosestSession(targetDist, cats);
            schedule[w1Day] = s;
            totalAnchored += s.distanceVal;
        }

        if (w2Day !== -1) {
            let targetDist = targetVolume * 0.15;
            let cats = [['short_interval'], ['fartlek'], ['tempo']][weekNum % 3];
            let s = getClosestSession(targetDist, cats);
            schedule[w2Day] = s;
            totalAnchored += s.distanceVal;
        }

        if (w3Day !== -1) {
            let targetDist = targetVolume * 0.15;
            let cats = [['fartlek'], ['tempo'], ['short_interval']][weekNum % 3];
            let s = getClosestSession(targetDist, cats);
            schedule[w3Day] = s;
            totalAnchored += s.distanceVal;
        }

        let remainder = Math.max(0, targetVolume - totalAnchored);
        let easyDistPerDay = easyDays.length > 0 ? (remainder / easyDays.length) : 0;
        
        if (easyDistPerDay < 2 && remainder > 0) easyDistPerDay = Math.max(2, remainder / easyDays.length);

        easyDays.forEach(d => {
            let dist = parseFloat(easyDistPerDay.toFixed(1));
            schedule[d] = {
                id: `dyn-easy-${weekNum}-${d}`,
                title: `${dist} Mile Easy Run`,
                category: "Easy",
                bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Easy",
                distanceVal: dist,
                summary: "Conversational pace.",
                sessionDetail: `${dist} Miles`,
                recoveryDetail: "None.",
                breakdown: `${dist} Miles continuous run @ [EASY].`,
                pacesList: [`${dist} Miles at [EASY]`]
            };
        });

        return schedule;
    };

    // Construct the Calendar
    const renderPlanWeeks = () => {
        if (!plan || !plan.weeklyVolumes) return null;
        
        const planStart = new Date(plan.planStartDate); 
        planStart.setHours(0,0,0,0);
        let weekNodes = [];

        for(let w = 0; w < plan.totalWeeks; w++) {
            let weekStart = new Date(planStart); weekStart.setDate(planStart.getDate() + (w * 7));
            let currentWeekTarget = plan.weeklyVolumes[w];
            let targetDisplay = unit === 'km' ? currentWeekTarget * 1.609 : currentWeekTarget;

            // Run the Anchor & Fill Algorithm for this specific week
            let weeklySchedule = assignRolesAndSessions(currentWeekTarget, plan.availableDayIndices, w);

            let dayNodes = [];

            for(let d = 0; d < 7; d++) {
                const currentDate = new Date(weekStart); currentDate.setDate(weekStart.getDate() + d);
                const dateKey = currentDate.toISOString().split('T')[0];
                const dayName = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][d];

                if (plan.goalType === 'race' && dateKey === plan.raceDate) {
                    dayNodes.push(
                        <div key={d} className="day-cell grad-gold" style={{color:'white', border:'none'}}>
                            <div className="day-name" style={{color:'rgba(255,255,255,0.8)'}}>{dayName}</div>
                            <div className="day-date" style={{color:'white'}}>{currentDate.getDate()} {currentDate.toLocaleString('default',{month:'short'})}</div>
                            <div className="day-type" style={{color:'white'}}>{plan.raceName}</div>
                            <div style={{fontSize:'0.85rem', fontWeight:900}}>{plan.distance} RACE DAY</div>
                        </div>
                    );
                } else if (!plan.daysAvailable[d]) {
                    dayNodes.push(
                        <div key={d} className="day-cell">
                            <div className="day-name">{dayName}</div>
                            <div className="day-date">{currentDate.getDate()} {currentDate.toLocaleString('default',{month:'short'})}</div>
                            <div className="day-rest">Rest Day</div>
                        </div>
                    );
                } else {
                    const sess = weeklySchedule[d] || sessions[0];
                    const isDone = completedSessions[dateKey];
                    
                    dayNodes.push(
                        <div key={d} className={`day-cell ${isDone ? 'completed' : ''}`}>
                            <div onClick={() => openSession(sess)}>
                                <div className="day-name">{dayName}</div>
                                <div className="day-date">{currentDate.getDate()} {currentDate.toLocaleString('default',{month:'short'})}</div>
                                <div className={`day-type type-${sess.category}`}>{sess.category}</div>
                                <div style={{fontSize:'0.8rem', fontWeight:600, color:'#2d3436', lineHeight:1.2, paddingRight: '20px'}}>
                                    {sess.title}
                                </div>
                            </div>
                            <div className={`done-toggle ${isDone ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleSessionDone(dateKey); }}>✓</div>
                        </div>
                    );
                }
            }
            
            if (plan.goalType !== 'race' && w % 4 === 0) {
                const blockNames = ["Phase 1: Foundation", "Phase 2: Aerobic Build", "Phase 3: Stamina", "Phase 4: Strength", "Phase 5: Speed Endurance", "Phase 6: Peak Fitness", "Phase 7: Maintenance"];
                const blockTitle = blockNames[Math.floor(w / 4)] || "Next Phase";
                weekNodes.push(
                    <div key={`block-${w}`} style={{ width: '100%', padding: '20px 0 10px 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {blockTitle}
                    </div>
                );
            }

            weekNodes.push(
                <div key={w} id={`week-${w}`} className="plan-week">
                    <div className="week-header">
                        <span>Week {w + 1}</span>
                        <span className="week-vol-tag">Target: {Math.round(targetDisplay)} {unit}</span>
                        <span>{weekStart.toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                    </div>
                    <div className="week-grid">{dayNodes}</div>
                </div>
            );
        }
        return weekNodes;
    };

    return (
        <>
            <SiteHeader />

            <div className="container">
                <h1 className="home-title">Running Workouts and 5K Pace Calculator</h1>
                <p className="intro-text">
                    Enter your 5k time in the box below and see your guided pace. Select a range of different training sessions and get tailored times that suit you based on the time you enter.
                </p>

                <div className="dashboard">
                    <div className="sidebar" id="pace-calculator">
                        <div className={`input-group${user ? '' : ' feature-hidden'}`} style={{ textAlign: 'center', marginBottom: '30px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px' }}>
                            {user ? (
                                <div>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '10px', fontWeight: 'bold' }}>
                                        Welcome, {user.displayName.split(' ')[0]}!
                                    </p>
                                    <button className="action-btn" onClick={logOut} style={{ background: '#e74c3c', color: 'white', marginTop: '0' }}>
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'rgba(255,255,255,0.8)' }}>
                                        Save your progress & plans securely.
                                    </p>
                                    <button className="action-btn feature-hidden" onClick={logInWithGoogle} style={{ background: 'white', color: 'var(--primary)', marginTop: '0' }}>
                                        Log In with Google
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="input-group">
                            <label>5K Time (MM:SS)</label>
                            <input type="text" value={timeInput} onChange={handleTimeInput} className="calc-input" placeholder="20:00" maxLength="5" inputMode="numeric" />
                        </div>
                        <div className="input-group">
                            <label>Gender</label>
                            <div className="gender-toggle">
                                <button className={`g-btn ${gender === 'male' ? 'active' : ''}`} onClick={() => setGender('male')}>MALE</button>
                                <button className={`g-btn ${gender === 'female' ? 'active' : ''}`} onClick={() => setGender('female')}>FEMALE</button>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Units</label>
                            <button className="action-btn" onClick={() => {
                                const nextUnit = unit === 'miles' ? 'km' : 'miles';
                                setUnit(nextUnit);
                                saveDistanceUnit(nextUnit);
                            }}>
                                Switch to {unit === 'miles' ? 'KM' : 'Miles'}
                            </button>
                        </div>
                        
                        {paces && (
                            <div className="results-box" style={{ display: 'block' }}>
                                <div className={`tier-badge tier-${paces.level.toLowerCase()}`}>{paces.level}</div>
                                <div className="res-row"><span className="res-label">Warm Up / Cool Down</span><span className="res-val">{formatTime(paces.warmup)}{unit==='miles'?' /mi':' /km'}</span></div>
                                <div className="res-row"><span className="res-label">Easy Run</span><span className="res-val">Max {formatTime(paces.easy)}{unit==='miles'?' /mi':' /km'}</span></div>
                                <div className="res-row"><span className="res-label">Long Run</span><span className="res-val">Conversation Pace</span></div>
                                <div className="res-row"><span className="res-label">Tempo</span><span className="res-val">{formatTime(paces.tempo)}{unit==='miles'?' /mi':' /km'}</span></div>
                                <div className="res-row"><span className="res-label">Threshold</span><span className="res-val">{formatTime(paces.threshold)}{unit==='miles'?' /mi':' /km'}</span></div>
                                <div className="res-row"><span className="res-label">Intervals</span><span className="res-val">{formatTime(paces.interval)}{unit==='miles'?' /mi':' /km'}</span></div>
                            </div>
                        )}
                        <button className="action-btn plan-btn feature-hidden" onClick={() => setIsPlanSetupOpen(true)}>Create Training Plan</button>
                    </div>

                    <button className="action-btn plan-btn plan-btn-mobile-fix feature-hidden" onClick={() => setIsPlanSetupOpen(true)} style={{display:'none'}}>Create Training Plan</button>

                    <div className="main-content" id="session-library">
                        <div className="view-toggle-nav">
                            <button className={`nav-pill ${view === 'library' ? 'active' : ''}`} onClick={() => setView('library')}>Session Library</button>
                            {plan && <button className={`nav-pill ${view === 'plan' ? 'active' : ''}`} onClick={() => setView('plan')}>My Training Plan</button>}
                        </div>

                        {view === 'library' && (
                            <div id="libraryView">
                                <div className="filter-area">
                                    <div className="filter-container">
                                        <button className={`filter-pill pill-all ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All</button>
                                        <button className={`filter-pill pill-gold ${activeFilter === 'Time Trial' ? 'active' : ''}`} onClick={() => setActiveFilter('Time Trial')}>Time Trial</button>
                                        <button className={`filter-pill pill-teal ${activeFilter === 'Tempo' ? 'active' : ''}`} onClick={() => setActiveFilter('Tempo')}>Tempo</button>
                                        <button className={`filter-pill pill-red ${activeFilter === 'Interval' ? 'active' : ''}`} onClick={() => setActiveFilter('Interval')}>Interval</button>
                                        <button className={`filter-pill pill-grey ${activeFilter === 'Fartlek' ? 'active' : ''}`} onClick={() => setActiveFilter('Fartlek')}>Fartlek</button>
                                        <button className={`filter-pill pill-purple ${activeFilter === 'Easy' ? 'active' : ''}`} onClick={() => setActiveFilter('Easy')}>Easy / Long</button>
                                    </div>
                                    <button className="sort-btn" onClick={toggleSort}>
                                        <span>{getSortIcon()}</span> <span>{getSortText()}</span>
                                    </button>
                                </div>
                                <label className="session-search-label" htmlFor="session-search">Find a workout</label>
                                <input
                                    id="session-search"
                                    className="session-search"
                                    type="search"
                                    value={sessionSearch}
                                    onChange={(event) => setSessionSearch(event.target.value)}
                                    placeholder="Search by name, distance, or type"
                                />
                                {(activeFilter === 'all' || activeFilter === 'Interval') && (
                                    <div className="reduced-session-controls library-reduced-controls">
                                        <button className="action-btn reduce-session-btn" onClick={() => setIsReducedSession((isReduced) => !isReduced)}>
                                            {isReducedSession ? 'Show Original Sessions' : 'Reduce Interval Sessions'}
                                        </button>
                                        <p className="reduced-session-note">
                                            Reduces Interval sessions only: removes tempo efforts, takes 200m off each remaining rep, removes reps of 200m or less, and leaves recovery unchanged.
                                        </p>
                                    </div>
                                )}
                                <div className="session-grid">
                                    {sessions
                                        .filter(s => (activeFilter === 'all' || s.category === activeFilter) && matchesSessionSearch(s, sessionSearch))
                                        .sort((a,b) => sortMode === 1 ? a.distanceVal - b.distanceVal : sortMode === 2 ? b.distanceVal - a.distanceVal : 0)
                                        .map(session => {
                                            let diffClass = "difficulty " + (session.difficulty.includes("Hard") || session.difficulty.includes("Max") ? "diff-hard" : session.difficulty.includes("Medium") || session.difficulty.includes("Moderate") ? "diff-med" : "diff-easy");
                                            const reducedWorkout = isReducedSession ? getReducedIntervalWorkout(session, unit) : null;
                                            const displayedSession = reducedWorkout ? { ...session, ...reducedWorkout } : session;
                                            const cardTitle = isReducedSession && reducedWorkout && !reducedWorkout.hasReps
                                                ? 'No reps remain after removing tempo efforts'
                                                : getSessionDisplayTitle(displayedSession);
                                            return (
                                                <div key={session.id} className="session-card" onClick={() => openSession(session)}>
                                                    <div className={`card-header ${session.bgClass}`}><span className="tag">{session.category}</span><h3 className="card-title">{formatTextForUnit(cardTitle)}</h3></div>
                                                    <div className="card-body">
                                                        <span className={diffClass} style={{color: session.diffColor}}>{session.difficulty}</span>
                                                        <div className="card-divider"></div>
                                                        <p className="card-summary">{formatTextForUnit(session.summary)}</p>
                                                        <Link className="session-details-link" href={getSessionUrl(session)} onClick={(event) => event.stopPropagation()}>View full session</Link>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                    {sessions.filter((session) =>
                                        (activeFilter === 'all' || session.category === activeFilter) &&
                                        matchesSessionSearch(session, sessionSearch)
                                    ).length === 0 && (
                                        <p className="no-results">No sessions match “{sessionSearch}”. Try a different name, distance, or type.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {view === 'plan' && plan && (
                            <div id="planView">
                                <div className="plan-header">
                                    <div className="plan-title-block">
                                        <h2>{plan.goalType === 'race' ? plan.raceName : 'General Fitness Plan'}</h2>
                                        <p>{plan.distance} Focus ({plan.ability}) {plan.goalTime ? `• Goal: ${plan.goalTime}` : ''}</p>
                                    </div>
                                    {plan.goalType === 'race' && (
                                        <div className="countdown-box">
                                            <span className="count-num">{Math.max(0, Math.ceil((new Date(plan.raceDate) - new Date().setHours(0,0,0,0)) / (24*60*60*1000)))}</span>
                                            <span className="count-label">Days To Go</span>
                                        </div>
                                    )}
                                </div>
                                <div id="planContainer">{renderPlanWeeks()}</div>
                                <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
                                    <button className="action-btn" onClick={() => setView('library')} style={{background:'#eee', color:'#636e72', flex:1}}>Back to Library</button>
                                    <button className="action-btn" onClick={confirmResetPlan} style={{background:'#f1f2f6', color:'#e74c3c', flex:1}}>Reset All Progress</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* INFO MODAL */}
            {infoModalSession && (() => {
                const sData = infoModalSession;
                const reducedWorkout = getReducedIntervalWorkout(sData, unit);
                const displayedSession = isReducedSession && reducedWorkout
                    ? { ...sData, ...reducedWorkout }
                    : sData;
                const modalTitle = isReducedSession && reducedWorkout && !reducedWorkout.hasReps
                    ? 'No reps remain after removing tempo efforts'
                    : getSessionDisplayTitle(displayedSession);
                
                const parsePaces = (text) => {
                    if(!text) return "";
                    let t = formatTextForUnit(text); 
                    if(paces) {
                        t = t.replace(/\[WARMUP\]/g, `<span class='pace-highlight'>${formatTime(paces.warmup)}</span>`)
                            .replace(/\[EASY\]/g, `<span class='pace-highlight'>Max ${formatTime(paces.easy)}</span>`)
                            .replace(/\[LONG\]/g, `<span class='pace-highlight'>${formatTime(paces.long)}</span>`)
                            .replace(/\[TEMPO\]/g, `<span class='pace-highlight'>${formatTime(paces.tempo)}</span>`)
                            .replace(/\[THRESHOLD\]/g, `<span class='pace-highlight'>${formatTime(paces.threshold)}</span>`)
                            .replace(/\[INTERVAL\]/g, `<span class='pace-highlight'>${formatTime(paces.interval)}</span>`)
                            .replace(/\[FLOAT\]/g, `<span class='pace-highlight'>${formatTime(paces.float)}</span>`)
                            .replace(/\[PACE_10K\]/g, `<span class='pace-highlight'>10k pace (${formatTime(paces.race10k)} /${unit === 'miles' ? 'mi' : 'km'})</span>`)
                            .replace(/\[PACE_5K\]/g, `<span class='pace-highlight'>5k pace (${formatTime(paces.race5k)} /${unit === 'miles' ? 'mi' : 'km'})</span>`)
                            .replace(/\[PACE_3K\]/g, `<span class='pace-highlight'>3k pace (${formatTime(paces.race3k)} /${unit === 'miles' ? 'mi' : 'km'})</span>`)
                            .replace(/\[PACE_1500M\]/g, `<span class='pace-highlight'>1500m pace (${formatTime(paces.race1500)} /${unit === 'miles' ? 'mi' : 'km'})</span>`)
                            .replace(/\[MAX_EFFORT\]/g, `<span class='pace-highlight'>MAX EFFORT</span>`);
                    }
                    return t;
                };

                return (
                    <div className="modal" style={{display: 'flex'}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="drag-handle"></div>
                                <div className="close-btn" onClick={() => setInfoModalSession(null)}>&times;</div>
                                <h2 style={{margin:'5px 0 0 0', color:'var(--primary)'}}>{formatTextForUnit(modalTitle)}</h2>
                                <div style={{fontSize:'0.85rem', color:'#636e72', marginTop:'5px', fontWeight:500}}>{sData.category}</div>
                            </div>
                            <div className="modal-body">
                                {isReducedSession && reducedWorkout && !reducedWorkout.hasReps && (
                                    <p className="reduced-session-note">This session contains only tempo efforts, so removing them leaves no reps to reduce.</p>
                                )}
                                {/* MISSING 5K TIME WARNING */}
                                {!paces && (
                                    <div style={{background: '#fff3cd', color: '#d63031', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #ffeaa7', lineHeight: '1.4'}}>
                                        ⚠️ Please enter your 5K time on the main dashboard to unlock your personalized running paces for this session!
                                    </div>
                                )}

                                {displayedSession.sessionDetail && (
                                    <div style={{marginBottom: '20px'}}>
                                        <h4 style={{margin:'0 0 5px 0', textTransform:'uppercase', color:'#b2bec3', fontSize:'0.8rem'}}>Session</h4>
                                        <div style={{fontWeight: '700', color: 'var(--primary)', fontSize: '1rem'}} dangerouslySetInnerHTML={{__html: parsePaces(displayedSession.sessionDetail)}}></div>
                                    </div>
                                )}
                                {isReducedSession && reducedWorkout?.hasReps && (
                                    <p className="reduced-session-note">Reduced version: tempo efforts removed and each remaining rep shortened by 200m. Reps of 200m or less are removed. Recovery stays the same.</p>
                                )}
                                {displayedSession.recoveryDetail && (
                                    <div style={{marginBottom: '20px'}}>
                                        <h4 style={{margin:'0 0 5px 0', textTransform:'uppercase', color:'#b2bec3', fontSize:'0.8rem'}}>Recovery</h4>
                                        <div style={{color: 'var(--text-dark)'}} dangerouslySetInnerHTML={{__html: parsePaces(displayedSession.recoveryDetail)}}></div>
                                    </div>
                                )}
                                {displayedSession.breakdown && (
                                    <div style={{marginBottom: '20px'}}>
                                        <h4 style={{margin:'0 0 5px 0', textTransform:'uppercase', color:'#b2bec3', fontSize:'0.8rem'}}>Breakdown</h4>
                                        <div style={{color: 'var(--text-dark)', lineHeight: '1.6'}} dangerouslySetInnerHTML={{__html: parsePaces(displayedSession.breakdown)}}></div>
                                    </div>
                                )}
                                {displayedSession.pacesList && displayedSession.pacesList.length > 0 && (
                                    <div style={{marginBottom: '20px'}}>
                                        <h4 style={{margin:'0 0 5px 0', textTransform:'uppercase', color:'#b2bec3', fontSize:'0.8rem'}}>Pace</h4>
                                        <div style={{color: 'var(--text-dark)', lineHeight: '1.6'}}>
                                            {displayedSession.pacesList.map((p, idx) => (
                                                <div key={idx} dangerouslySetInnerHTML={{__html: parsePaces(p)}}></div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer"><button className="big-close-btn" onClick={() => setInfoModalSession(null)}>Close Session</button></div>
                        </div>
                    </div>
                )
            })()}

            {/* PLAN SETUP MODAL */}
            {isPlanSetupOpen && (
                <div className="modal" style={{display: 'flex'}}>
                    <div className="modal-content" style={{maxHeight:'85vh'}}>
                        <div className="modal-header">
                            <div className="close-btn" onClick={() => setIsPlanSetupOpen(false)}>&times;</div>
                            <h2 style={{margin:0, color:'var(--primary)'}}>Setup Your Plan</h2>
                        </div>
                        <div className="modal-body">
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                                <div className="form-group"><label className="form-label">Name</label><input type="text" className="form-input" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                                <div className="form-group">
                                    <label className="form-label">Age</label>
                                    <input type="number" min="0" onKeyDown={(e) => { if(e.key === '-' || e.key === 'e') e.preventDefault(); }} className="form-input" placeholder="e.g. 30" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Primary Goal</label>
                                <select className="form-input" value={form.goalType} onChange={e => setForm({...form, goalType: e.target.value})}>
                                    <option value="race">Train for a Race</option>
                                    <option value="new_starter">New Starter (Couch to Fitness)</option>
                                    <option value="gain_fitness">Gain Fitness</option>
                                    <option value="maintain_fitness">Maintain Fitness</option>
                                    <option value="build_fitness">Build Fitness (Volume)</option>
                                </select>
                            </div>

                            {form.goalType === 'race' && (
                                <div style={{background: '#f8fafb', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee'}}>
                                    <div className="form-group"><label className="form-label">Race Name</label><input type="text" className="form-input" placeholder="e.g. London Marathon" value={form.raceName} onChange={e => setForm({...form, raceName: e.target.value})} /></div>
                                    <div className="form-group"><label className="form-label">Race Date</label><input type="date" className="form-input" value={form.raceDate} onChange={e => setForm({...form, raceDate: e.target.value})} /></div>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Target Distance Focus</label>
                                <select className="form-input" value={form.distance} onChange={e => setForm({...form, distance: e.target.value})}>
                                    <option value="5k">5k</option><option value="10k">10k</option><option value="Half Marathon">Half Marathon</option><option value="Marathon">Marathon</option>
                                </select>
                            </div>

                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                                <div className="form-group">
                                    <label className="form-label">Years Running</label>
                                    <input type="number" min="0" onKeyDown={(e) => { if(e.key === '-' || e.key === 'e') e.preventDefault(); }} className="form-input" placeholder="e.g. 2" value={form.yearsRunning} onChange={e => setForm({...form, yearsRunning: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Goal Time (Optional)</label>
                                    <input type="text" className="form-input" placeholder="HH:MM:SS" maxLength="8" inputMode="numeric" value={form.goalTime} onChange={handleGoalTimeInput} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Current Weekly Volume</label>
                                <div style={{display:'flex', gap:'10px'}}>
                                    <input type="number" min="0" onKeyDown={(e) => { if(e.key === '-' || e.key === 'e') e.preventDefault(); }} className="form-input" placeholder="e.g. 25" value={form.currentVolume} onChange={e => setForm({...form, currentVolume: e.target.value})} />
                                    <select className="form-input" style={{width:'110px'}} value={form.volUnit} onChange={e => setForm({...form, volUnit: e.target.value})}>
                                        <option value="miles">Miles</option><option value="km">KM</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Weekly Running Days</label>
                                <div className="day-selector">
                                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => (
                                        <div key={day} className="day-check">
                                            <input type="checkbox" id={`d${day}`} checked={form[`d${day}`]} onChange={e => setForm({...form, [`d${day}`]: e.target.checked})} />
                                            <label htmlFor={`d${day}`}>{day.charAt(0)}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer"><button className="big-close-btn" onClick={generatePlan}>Generate Plan</button></div>
                    </div>
                </div>
            )}

            {/* PSYCHOLOGY LOADING SCREEN */}
            {isGenerating && (
                <div className="modal" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary)', zIndex: 9999}}>
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <div className="spinner" style={{ marginBottom: '30px' }}>
                            <div style={{ width: '50px', height: '50px', border: '5px solid rgba(255,255,255,0.2)', borderTop: '5px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {loadingMessage}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '15px', fontSize: '0.9rem' }}>
                            This takes a few seconds to ensure your plan is safe and perfectly scaled.
                        </p>
                    </div>
                    <style dangerouslySetInnerHTML={{__html: `
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    `}} />
                </div>
            )}
        </>
    );
}