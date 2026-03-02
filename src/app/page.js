"use client";
import React, { useState, useEffect } from 'react';
import './globals.css'; 

import { auth, db, logInWithGoogle, logOut } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const sessionTypes = {
    short_interval: [10, 12, 16, 17, 25, 41, 45],
    long_interval: [3, 11, 15, 40, 42, 44],
    tempo: [2, 5, 6, 9, 18, 19, 20, 24, 38, 39],
    fartlek: [4, 7, 8, 13, 14, 21, 22, 23],
    long_run: [29, 30, 31, 32, 33, 34, 35, 36, 37, 43],
    easy: [26, 27, 28]
};

const sessions = [
    // --- TIME TRIALS ---
    { id: 1, title: "5k Time Trial", category: "Time Trial", bgClass: "grad-gold", diffColor: "#d35400", difficulty: "Max Effort", distanceVal: 5, summary: "3.1 Mile Time Trial // 90-95% Intensity",
      sessionDetail: "3.1 Miles", recoveryDetail: "None.",
      breakdown: "10 minute warmup / 3.1 Miles @ [MAX_EFFORT] / 10 minute cool down.",
      pacesList: ["3.1 Miles at [MAX_EFFORT]"] },

    // --- TEMPO SESSIONS ---
    { id: 2, title: "7 Mile Alternating Tempo", category: "Tempo", bgClass: "grad-teal", diffColor: "#16a085", difficulty: "Hard", distanceVal: 11, summary: "Alternating tempo miles with float recovery.",
      sessionDetail: "1 Fast / 1 Float x 5", recoveryDetail: "1 Mile float between fast miles.",
      breakdown: "10 minute warmup / 1 Mile @ [TEMPO] / 1 Mile @ [FLOAT] / 1 Mile @ [TEMPO] / 1 Mile @ [FLOAT] / 1 Mile @ [TEMPO] / 1 Mile @ [FLOAT] / 1 Mile @ [TEMPO] / 1 Mile @ [FLOAT] / 1 Mile @ [TEMPO] / 1 Mile @ [FLOAT] / 10 minute cool down.",
      pacesList: ["5x 1 Mile at [TEMPO]", "5x 1 Mile at [FLOAT]"] },

    { id: 5, title: "5 Mile Progressive", category: "Tempo", bgClass: "grad-teal", diffColor: "#16a085", difficulty: "Hard", distanceVal: 8, summary: "Progressive tempo run.",
      sessionDetail: "5 Miles Progressive", recoveryDetail: "None.",
      breakdown: "10 minute warmup / 5 Miles continuous run progressing steadily from [EASY] to [TEMPO] / 10 minute cool down.",
      pacesList: ["5 Miles building to [TEMPO]"] },

    { id: 6, title: "6 Mile Progressive", category: "Tempo", bgClass: "grad-teal", diffColor: "#16a085", difficulty: "Hard", distanceVal: 10, summary: "Extended progressive tempo.",
      sessionDetail: "6 Miles Progressive", recoveryDetail: "None.",
      breakdown: "10 minute warmup / 6 Miles continuous run progressing steadily from [EASY] to [THRESHOLD] / 10 minute cool down.",
      pacesList: ["6 Miles building to [THRESHOLD]"] },

    { id: 9, title: "4 Mile Progressive", category: "Tempo", bgClass: "grad-teal", diffColor: "#16a085", difficulty: "Medium", distanceVal: 7, summary: "Short continuous tempo.",
      sessionDetail: "4 Miles Progressive", recoveryDetail: "None.",
      breakdown: "10 minute warmup / 4 Miles continuous run progressing steadily from [EASY] to [TEMPO] / 10 minute cool down.",
      pacesList: ["4 Miles building to [TEMPO]"] },

    { id: 18, title: "10 Mile Progressive", category: "Tempo", bgClass: "grad-teal", diffColor: "#16a085", difficulty: "Very Hard", distanceVal: 16, summary: "Marathon simulation.",
      sessionDetail: "10 Miles Progressive", recoveryDetail: "None.",
      breakdown: "10 minute warmup / 10 Miles continuous run progressing steadily from [EASY] to [THRESHOLD] / 10 minute cool down.",
      pacesList: ["10 Miles building to [THRESHOLD]"] },

    { id: 19, title: "3 & 3 Mile Broken Tempo", category: "Tempo", bgClass: "grad-teal", diffColor: "#16a085", difficulty: "Hard", distanceVal: 12, summary: "Double Tempo blocks.",
      sessionDetail: "3 Miles / 3 Miles", recoveryDetail: "5 minutes easy walking between runs.",
      breakdown: "10 minute warmup / 3 Miles @ [TEMPO] / 5 minute recovery / 3 Miles @ [TEMPO] / 10 minute cool down.",
      pacesList: ["2x 3 Miles at [TEMPO]"] },

    { id: 20, title: "10 Mile Alternating Tempo", category: "Tempo", bgClass: "grad-teal", diffColor: "#16a085", difficulty: "Very Hard", distanceVal: 16, summary: "No rest Tempo.",
      sessionDetail: "1 Fast / 1 Float x 5", recoveryDetail: "1 Mile float between fast miles.",
      breakdown: "10 minute warmup / 5x (1 Mile @ [TEMPO] / 1 Mile @ [FLOAT]) / 10 minute cool down.",
      pacesList: ["5x 1 Mile at [TEMPO]", "5x 1 Mile at [FLOAT]"] },

    { id: 38, title: "10 Mile Progressive Long Run", category: "Tempo", bgClass: "grad-teal", diffColor: "#16a085", difficulty: "Very Hard", distanceVal: 10, summary: "Endurance + Speed.",
      sessionDetail: "10 Miles Continuous", recoveryDetail: "None.",
      breakdown: "4 Miles @ [EASY] / 3 Miles @ [TEMPO] / 2.5 Miles @ [THRESHOLD] / 0.5 Mile cool down @ [EASY].",
      pacesList: ["4 Miles at [EASY]", "3 Miles at [TEMPO]", "2.5 Miles at [THRESHOLD]"] },

    { id: 39, title: "Tempo 2-1 Split", category: "Tempo", bgClass: "grad-teal", diffColor: "#16a085", difficulty: "Hard", distanceVal: 6, summary: "Build effort.",
      sessionDetail: "2 Miles / 1 Mile", recoveryDetail: "3 minutes easy walking between runs.",
      breakdown: "10 minute warmup / 2 Miles @ [THRESHOLD] / 3 minute recovery / 1 Mile @ [INTERVAL] / 10 minute cool down.",
      pacesList: ["2 Miles at [THRESHOLD]", "1 Mile at [INTERVAL]"] },

    // --- INTERVAL SESSIONS ---
    { id: 3, title: "Tempo & Threshold Mix", category: "Interval", bgClass: "grad-red", diffColor: "#c0392b", difficulty: "Medium", distanceVal: 10, summary: "Tempo, Threshold and Speed mix.",
      sessionDetail: "1 Mile / 2x 0.5 Miles / 4x 0.25 Miles", recoveryDetail: "60s between short runs | 3 minutes between sets.",
      breakdown: "10 minute warmup / 1 Mile @ [TEMPO] / 3 minute recovery / 0.5 Miles @ [THRESHOLD] / 60s recovery / 0.5 Miles @ [THRESHOLD] / 3 minute recovery / 0.25 Miles @ [INTERVAL] / 60s recovery / 0.25 Miles @ [INTERVAL] / 60s recovery / 0.25 Miles @ [INTERVAL] / 60s recovery / 0.25 Miles @ [INTERVAL] / 10 minute cool down.",
      pacesList: ["1 Mile at [TEMPO]", "2x 0.5 Miles at [THRESHOLD]", "4x 0.25 Miles at [INTERVAL]"] },

    { id: 10, title: "2k-800-400 Track Pyramid", category: "Interval", bgClass: "grad-red", diffColor: "#c0392b", difficulty: "Hard", distanceVal: 10, summary: "Tempo buy-in + intervals.",
      sessionDetail: "2km / 3x 800m / 3x 600m / 3x 400m", recoveryDetail: "90s between reps | 3 minutes between sets.",
      breakdown: "10 minute warmup / 2km @ [TEMPO] / 3 minute recovery / 800m @ [INTERVAL] / 90s recovery / 800m @ [INTERVAL] / 90s recovery / 800m @ [INTERVAL] / 3 minute recovery / 600m @ [INTERVAL] / 90s recovery / 600m @ [INTERVAL] / 90s recovery / 600m @ [INTERVAL] / 3 minute recovery / 400m @ [INTERVAL] / 90s recovery / 400m @ [INTERVAL] / 90s recovery / 400m @ [INTERVAL] / 10 minute cool down.",
      pacesList: ["2km at [TEMPO]", "3x 800m at [INTERVAL]", "3x 600m at [INTERVAL]", "3x 400m at [INTERVAL]"] },

    { id: 11, title: "Mile Tempo & Track Ladder", category: "Interval", bgClass: "grad-red", diffColor: "#c0392b", difficulty: "Very Hard", distanceVal: 12, summary: "Mile Tempo + VO2 ladder.",
      sessionDetail: "1 Mile / 3x 400m / 2x 600m / 1200m / 2x 600m / 3x 400m", recoveryDetail: "90s between reps | 2 minutes between sets.",
      breakdown: "10 minute warmup / 1 Mile @ [TEMPO] / 2 minute recovery / 3x 400m @ [INTERVAL] (90s recovery) / 2 minute recovery / 2x 600m @ [INTERVAL] (90s recovery) / 2 minute recovery / 1200m @ [THRESHOLD] / 2 minute recovery / 2x 600m @ [INTERVAL] (90s recovery) / 2 minute recovery / 3x 400m @ [INTERVAL] (90s recovery) / 10 minute cool down.",
      pacesList: ["1 Mile at [TEMPO]", "6x 400m at [INTERVAL]", "4x 600m at [INTERVAL]", "1200m at [THRESHOLD]"] },

    { id: 15, title: "8x800 & 8x400 Track", category: "Interval", bgClass: "grad-red", diffColor: "#c0392b", difficulty: "Very Hard", distanceVal: 14, summary: "High volume speed.",
      sessionDetail: "8x 800m / 8x 400m", recoveryDetail: "90s between reps | 3 minutes between sets.",
      breakdown: "10 minute warmup / 8x 800m @ [TEMPO] (90s recovery between each) / 3 minute recovery / 8x 400m @ [TEMPO] (90s recovery between each) / 10 minute cool down.",
      pacesList: ["8x 800m at [TEMPO]", "8x 400m at [TEMPO]"] },

    { id: 16, title: "800-400-600-300 Threshold", category: "Interval", bgClass: "grad-red", diffColor: "#c0392b", difficulty: "Hard", distanceVal: 9, summary: "Varied Threshold.",
      sessionDetail: "2x 800m / 3x 400m / 2x 600m / 4x 300m", recoveryDetail: "60s between reps | 2 minutes between sets.",
      breakdown: "10 minute warmup / 2x 800m @ [THRESHOLD] (60s recovery) / 2 minute recovery / 3x 400m @ [THRESHOLD] (60s recovery) / 2 minute recovery / 2x 600m @ [THRESHOLD] (60s recovery) / 2 minute recovery / 4x 300m @ [THRESHOLD] (60s recovery) / 10 minute cool down.",
      pacesList: ["2x 800m at [THRESHOLD]", "3x 400m at [THRESHOLD]", "2x 600m at [THRESHOLD]", "4x 300m at [THRESHOLD]"] },

    { id: 17, title: "Descending Threshold Track", category: "Interval", bgClass: "grad-red", diffColor: "#c0392b", difficulty: "Hard", distanceVal: 9, summary: "Descending ladder.",
      sessionDetail: "800m / 2x 1000m / 3x 600m / 4x 400m", recoveryDetail: "60s between all reps.",
      breakdown: "10 minute warmup / 800m @ [THRESHOLD] / 60s recovery / 2x 1000m @ [THRESHOLD] (60s recovery) / 3x 600m @ [THRESHOLD] (60s recovery) / 4x 400m @ [THRESHOLD] (60s recovery) / 10 minute cool down.",
      pacesList: ["800m at [THRESHOLD]", "2x 1000m at [THRESHOLD]", "3x 600m at [THRESHOLD]", "4x 400m at [THRESHOLD]"] },

    { id: 40, title: "Drop Set Intervals", category: "Interval", bgClass: "grad-red", diffColor: "#c0392b", difficulty: "Hard", distanceVal: 8, summary: "Shorter/Faster.",
      sessionDetail: "1000m / 800m / 600m / 400m / 200m", recoveryDetail: "90s between all reps.",
      breakdown: "10 minute warmup / 1000m @ [INTERVAL] / 90s recovery / 800m @ [INTERVAL] / 90s recovery / 600m @ [INTERVAL] / 90s recovery / 400m @ [INTERVAL] / 90s recovery / 200m @ [INTERVAL] / 10 minute cool down.",
      pacesList: ["1000m at [INTERVAL]", "800m at [INTERVAL]", "600m at [INTERVAL]", "400m at [INTERVAL]", "200m at [INTERVAL]"] },

    { id: 42, title: "Pyramid Intervals", category: "Interval", bgClass: "grad-red", diffColor: "#c0392b", difficulty: "Very Hard", distanceVal: 7, summary: "200 to 1600 back to 200.",
      sessionDetail: "200m / 400m / 800m / 1200m / 1600m / 1200m / 800m / 400m / 200m", recoveryDetail: "60s for short reps | 90s for long reps.",
      breakdown: "10 minute warmup / 200m @ [INTERVAL] / 60s recovery / 400m @ [INTERVAL] / 60s recovery / 800m @ [INTERVAL] / 90s recovery / 1200m @ [INTERVAL] / 90s recovery / 1600m @ [INTERVAL] / 90s recovery / 1200m @ [INTERVAL] / 90s recovery / 800m @ [INTERVAL] / 90s recovery / 400m @ [INTERVAL] / 60s recovery / 200m @ [INTERVAL] / 10 minute cool down.",
      pacesList: ["2x 200m at [INTERVAL]", "2x 400m at [INTERVAL]", "2x 800m at [INTERVAL]", "2x 1200m at [INTERVAL]", "1600m at [INTERVAL]"] },

    { id: 44, title: "Mile Up & Overs", category: "Interval", bgClass: "grad-red", diffColor: "#c0392b", difficulty: "Very Hard", distanceVal: 5, summary: "Segmented miles.",
      sessionDetail: "4x 1 Mile (Changing speeds)", recoveryDetail: "3 minutes between miles.",
      breakdown: "10 minute warmup / 4x (1 Mile alternating 400m @ [INTERVAL] and 400m @ [FLOAT]) / 3 minute recovery between miles / 10 minute cool down.",
      pacesList: ["4x 1 Mile alternating [INTERVAL] and [FLOAT]"] },

    // --- FARTLEK SESSIONS ---
    { id: 4, title: "3-5-1 Threshold Ladder", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Hard", distanceVal: 10, summary: "Time-based intervals.",
      sessionDetail: "3 / 4 / 5 / 3 / 2 / 1", recoveryDetail: "60s between each rep.",
      breakdown: "10 minute warmup / 3 minutes @ [THRESHOLD] / 60s recovery / 4 minutes @ [THRESHOLD] / 60s recovery / 5 minutes @ [THRESHOLD] / 60s recovery / 3 minutes @ [THRESHOLD] / 60s recovery / 2 minutes @ [THRESHOLD] / 60s recovery / 1 minute @ [THRESHOLD] / 10 minute cool down.",
      pacesList: ["3 minutes at [THRESHOLD]", "4 minutes at [THRESHOLD]", "5 minutes at [THRESHOLD]", "3 minutes at [THRESHOLD]", "2 minutes at [THRESHOLD]", "1 minute at [THRESHOLD]"] },

    { id: 7, title: "1-4-1 Pyramid Fartlek", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Hard", distanceVal: 9, summary: "Mixed time-based reps.",
      sessionDetail: "1 / 4 / 2 / 3 / 3 / 2 / 4 / 1", recoveryDetail: "60s between each rep.",
      breakdown: "10 minute warmup / 1 minute @ [THRESHOLD] / 60s recovery / 4 minutes @ [THRESHOLD] / 60s recovery / 2 minutes @ [THRESHOLD] / 60s recovery / 3 minutes @ [THRESHOLD] / 60s recovery / 3 minutes @ [THRESHOLD] / 60s recovery / 2 minutes @ [THRESHOLD] / 60s recovery / 4 minutes @ [THRESHOLD] / 60s recovery / 1 minute @ [THRESHOLD] / 10 minute cool down.",
      pacesList: ["1 minute at [THRESHOLD]", "4 minutes at [THRESHOLD]", "2 minutes at [THRESHOLD]", "3 minutes at [THRESHOLD]", "3 minutes at [THRESHOLD]", "2 minutes at [THRESHOLD]", "4 minutes at [THRESHOLD]", "1 minute at [THRESHOLD]"] },

    { id: 8, title: "2-3-4-2-3 Fartlek", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Very Hard", distanceVal: 10, summary: "Tempo surging.",
      sessionDetail: "2 / 3 / 4 / 2 / 3 (Ending fast)", recoveryDetail: "90s between each block.",
      breakdown: "10 minute warmup / 2 minutes @ [TEMPO] directly into 1 minute @ [INTERVAL] / 90s recovery / 3 minutes @ [TEMPO] directly into 1 minute @ [INTERVAL] / 90s recovery / 4 minutes @ [TEMPO] directly into 1 minute @ [INTERVAL] / 90s recovery / 2 minutes @ [TEMPO] directly into 1 minute @ [INTERVAL] / 90s recovery / 3 minutes @ [TEMPO] directly into 1 minute @ [INTERVAL] / 10 minute cool down.",
      pacesList: ["2 minutes at [TEMPO], 1 minute at [INTERVAL]", "3 minutes at [TEMPO], 1 minute at [INTERVAL]", "4 minutes at [TEMPO], 1 minute at [INTERVAL]", "2 minutes at [TEMPO], 1 minute at [INTERVAL]", "3 minutes at [TEMPO], 1 minute at [INTERVAL]"] },

    { id: 12, title: "12x90s Fartlek", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Medium", distanceVal: 8, summary: "Short sharp reps.",
      sessionDetail: "12x 90s", recoveryDetail: "60s between each rep.",
      breakdown: "10 minute warmup / 12x 90 seconds @ [INTERVAL] with 60s recovery between each / 10 minute cool down.",
      pacesList: ["12x 90 seconds at [INTERVAL]"] },

    { id: 13, title: "1-3-1 Pyramid & Tempo Miles", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Hard", distanceVal: 11, summary: "Total fitness test.",
      sessionDetail: "1 Mile / 1 / 2 / 3 / 2 / 1 / 1 Mile", recoveryDetail: "60s between short reps | 3 minutes before miles.",
      breakdown: "10 minute warmup / 1 Mile @ [TEMPO] / 3 minute recovery / 1 minute @ [THRESHOLD] / 60s recovery / 2 minutes @ [THRESHOLD] / 60s recovery / 3 minutes @ [THRESHOLD] / 60s recovery / 2 minutes @ [THRESHOLD] / 60s recovery / 1 minute @ [THRESHOLD] / 3 minute recovery / 1 Mile @ [TEMPO] / 10 minute cool down.",
      pacesList: ["1 Mile at [TEMPO]", "1 minute at [THRESHOLD]", "2 minutes at [THRESHOLD]", "3 minutes at [THRESHOLD]", "2 minutes at [THRESHOLD]", "1 minute at [THRESHOLD]", "1 Mile at [TEMPO]"] },

    { id: 14, title: "3-2-1 Mixed Fartlek", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Hard", distanceVal: 10, summary: "Varied paces.",
      sessionDetail: "1 Mile / 2x 3 mins / 3x 90s / 2x 2 mins / 4x 60s", recoveryDetail: "60s between all reps.",
      breakdown: "10 minute warmup / 1 Mile @ [TEMPO] / 60s recovery / 2x 3 minutes @ [THRESHOLD] (60s recovery) / 3x 90 seconds @ [INTERVAL] (60s recovery) / 2x 2 minutes @ [THRESHOLD] (60s recovery) / 4x 60 seconds @ [INTERVAL] (60s recovery) / 10 minute cool down.",
      pacesList: ["1 Mile at [TEMPO]", "2x 3 minutes at [THRESHOLD]", "3x 90 seconds at [INTERVAL]", "2x 2 minutes at [THRESHOLD]", "4x 60 seconds at [INTERVAL]"] },

    { id: 21, title: "1 Mile & 10x60s Fartlek", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Hard", distanceVal: 9, summary: "Aerobic into speed.",
      sessionDetail: "1 Mile / 10x 60s", recoveryDetail: "60s between short reps | 3 minutes after the mile.",
      breakdown: "10 minute warmup / 1 Mile @ [TEMPO] / 3 minute recovery / 10x 60 seconds @ [INTERVAL] (60s recovery) / 10 minute cool down.",
      pacesList: ["1 Mile at [TEMPO]", "10x 60 seconds at [INTERVAL]"] },

    { id: 22, title: "1-5-1 Tempo Pyramid", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Hard", distanceVal: 10, summary: "Volume ladder.",
      sessionDetail: "1 / 2 / 3 / 4 / 5 / 4 / 3 / 2 / 1", recoveryDetail: "60s between each rep.",
      breakdown: "10 minute warmup / 1 minute @ [TEMPO] / 60s recovery / 2 minutes @ [TEMPO] / 60s recovery / 3 minutes @ [TEMPO] / 60s recovery / 4 minutes @ [TEMPO] / 60s recovery / 5 minutes @ [TEMPO] / 60s recovery / 4 minutes @ [TEMPO] / 60s recovery / 3 minutes @ [TEMPO] / 60s recovery / 2 minutes @ [TEMPO] / 60s recovery / 1 minute @ [TEMPO] / 10 minute cool down.",
      pacesList: ["1 minute at [TEMPO]", "2 minutes at [TEMPO]", "3 minutes at [TEMPO]", "4 minutes at [TEMPO]", "5 minutes at [TEMPO]", "4 minutes at [TEMPO]", "3 minutes at [TEMPO]", "2 minutes at [TEMPO]", "1 minute at [TEMPO]"] },

    { id: 23, title: "3 Sets of 1-2-3 Fartlek", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Medium", distanceVal: 8, summary: "Manageable chunks.",
      sessionDetail: "3x (1 / 2 / 3)", recoveryDetail: "60s between reps | 2 minutes between sets.",
      breakdown: "10 minute warmup / 3x (1 minute @ [TEMPO] / 60s recovery / 2 minutes @ [TEMPO] / 60s recovery / 3 minutes @ [TEMPO]) / 2 minute recovery between sets / 10 minute cool down.",
      pacesList: ["3x 1 minute at [TEMPO]", "3x 2 minutes at [TEMPO]", "3x 3 minutes at [TEMPO]"] },

    { id: 24, title: "5x5 Minute Tempo Fartlek", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Hard", distanceVal: 10, summary: "Specific strength.",
      sessionDetail: "5x 5 Mins", recoveryDetail: "90s between reps.",
      breakdown: "10 minute warmup / 5x 5 minutes @ [TEMPO] with 90s recovery / 10 minute cool down.",
      pacesList: ["5x 5 minutes at [TEMPO]"] },

    { id: 25, title: "10x2 Minute Fartlek", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Medium", distanceVal: 8, summary: "Rhythm building.",
      sessionDetail: "10x 2 Mins", recoveryDetail: "60s between reps.",
      breakdown: "10 minute warmup / 10x 2 minutes @ [TEMPO] with 60s recovery / 10 minute cool down.",
      pacesList: ["10x 2 minutes at [TEMPO]"] },

    { id: 41, title: "Rolling 800s", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Hard", distanceVal: 6, summary: "Continuous gear changes.",
      sessionDetail: "4x 800m", recoveryDetail: "800m float recovery.",
      breakdown: "10 minute warmup / 4x (800m @ [INTERVAL] / 800m @ [FLOAT]) / 10 minute cool down.",
      pacesList: ["4x 800m at [INTERVAL]"] },

    { id: 45, title: "Rolling 400s", category: "Fartlek", bgClass: "grad-grey", diffColor: "#7f8fa6", difficulty: "Hard", distanceVal: 5, summary: "Short gear changes.",
      sessionDetail: "5x 400m", recoveryDetail: "400m float recovery.",
      breakdown: "10 minute warmup / 5x (400m @ [INTERVAL] / 400m @ [FLOAT]) / 10 minute cool down.",
      pacesList: ["5x 400m at [INTERVAL]"] },

    // --- EASY / LONG SESSIONS ---
    { id: 26, title: "4 Mile Easy Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Easy", distanceVal: 4, summary: "Conversational pace.",
      sessionDetail: "4 Miles", recoveryDetail: "None.",
      breakdown: "4 Miles continuous run @ [EASY].", pacesList: ["4 Miles at [EASY]"] },

    { id: 27, title: "5 Mile Easy Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Easy", distanceVal: 5, summary: "Conversational pace.",
      sessionDetail: "5 Miles", recoveryDetail: "None.",
      breakdown: "5 Miles continuous run @ [EASY].", pacesList: ["5 Miles at [EASY]"] },

    { id: 28, title: "6 Mile Easy Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Easy", distanceVal: 6, summary: "Conversational pace.",
      sessionDetail: "6 Miles", recoveryDetail: "None.",
      breakdown: "6 Miles continuous run @ [EASY].", pacesList: ["6 Miles at [EASY]"] },

    { id: 29, title: "7 Mile Long Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Moderate", distanceVal: 7, summary: "Base endurance.",
      sessionDetail: "7 Miles", recoveryDetail: "None.",
      breakdown: "7 Miles continuous run @ [LONG].", pacesList: ["7 Miles at [LONG]"] },

    { id: 30, title: "8 Mile Long Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Moderate", distanceVal: 8, summary: "Base endurance.",
      sessionDetail: "8 Miles", recoveryDetail: "None.",
      breakdown: "8 Miles continuous run @ [LONG].", pacesList: ["8 Miles at [LONG]"] },

    { id: 31, title: "9 Mile Long Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Moderate", distanceVal: 9, summary: "Base endurance.",
      sessionDetail: "9 Miles", recoveryDetail: "None.",
      breakdown: "9 Miles continuous run @ [LONG].", pacesList: ["9 Miles at [LONG]"] },

    { id: 32, title: "10 Mile Long Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Moderate", distanceVal: 10, summary: "Base endurance.",
      sessionDetail: "10 Miles", recoveryDetail: "None.",
      breakdown: "10 Miles continuous run @ [LONG].", pacesList: ["10 Miles at [LONG]"] },

    { id: 33, title: "11 Mile Long Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Moderate", distanceVal: 11, summary: "Base endurance.",
      sessionDetail: "11 Miles", recoveryDetail: "None.",
      breakdown: "11 Miles continuous run @ [LONG].", pacesList: ["11 Miles at [LONG]"] },

    { id: 34, title: "12 Mile Long Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Moderate", distanceVal: 12, summary: "Base endurance.",
      sessionDetail: "12 Miles", recoveryDetail: "None.",
      breakdown: "12 Miles continuous run @ [LONG].", pacesList: ["12 Miles at [LONG]"] },

    { id: 35, title: "13 Mile Long Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Moderate", distanceVal: 13, summary: "Half Marathon distance.",
      sessionDetail: "13 Miles", recoveryDetail: "None.",
      breakdown: "13 Miles continuous run @ [LONG].", pacesList: ["13 Miles at [LONG]"] },

    { id: 36, title: "14 Mile Long Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Hard", distanceVal: 14, summary: "Marathon prep.",
      sessionDetail: "14 Miles", recoveryDetail: "None.",
      breakdown: "14 Miles continuous run @ [LONG].", pacesList: ["14 Miles at [LONG]"] },

    { id: 37, title: "15 Mile Long Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Hard", distanceVal: 15, summary: "Marathon prep.",
      sessionDetail: "15 Miles", recoveryDetail: "None.",
      breakdown: "15 Miles continuous run @ [LONG].", pacesList: ["15 Miles at [LONG]"] },

    { id: 43, title: "11 Mile Hotspot Long Run", category: "Easy", bgClass: "grad-purple", diffColor: "#8e44ad", difficulty: "Moderate", distanceVal: 11, summary: "Long + 1/2mi fast.",
      sessionDetail: "11 Miles with Hotspot", recoveryDetail: "None.",
      breakdown: "7 Miles @ [LONG] / 0.5 Miles @ [INTERVAL] / 3.5 Miles @ [LONG].", pacesList: ["7 Miles at [LONG]", "0.5 Miles at [INTERVAL]", "3.5 Miles at [LONG]"] }
];

export default function The11thMile() {
    const [timeInput, setTimeInput] = useState("");
    const [unit, setUnit] = useState('miles');
    const [gender, setGender] = useState('male');
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortMode, setSortMode] = useState(0);
    const [view, setView] = useState('library');
    const [plan, setPlan] = useState(null);
    const [completedSessions, setCompletedSessions] = useState({});
    
    // Modal states
    const [infoModalSession, setInfoModalSession] = useState(null);
    const [isPlanSetupOpen, setIsPlanSetupOpen] = useState(false);

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
    const parseTime = (str) => { if(!str || !str.includes(":")) return 0; const parts = str.split(":"); return (parseInt(parts[0]) * 60) + parseInt(parts[1]); };
    const formatTime = (secs) => { const m = Math.floor(secs / 60), s = Math.round(secs % 60); return `${m}:${s < 10 ? '0' : ''}${s}`; };
    const getAbilityLevel = (secs, g) => {
        let m = secs / 60; 
        if(g === 'male') return m < 16 ? "Elite" : m < 20 ? "Advanced" : m < 25 ? "Intermediate" : "Beginner";
        return m < 18 ? "Elite" : m < 23 ? "Advanced" : m < 28 ? "Intermediate" : "Beginner";
    };

    const formatTextForUnit = (text) => {
        if (!text) return text;
        if (unit === 'miles') return text;
        return text.replace(/(\d+(\.\d+)?)\s*Miles?/gi, (match, p1) => {
            const miles = parseFloat(p1);
            if (miles === 0.25) return "400m";
            if (miles === 0.5 || miles === 0.50) return "800m";
            const km = (miles * 1.60934).toFixed(1).replace(/\.0$/, ''); 
            return `${km}km`;
        });
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
        const totalSeconds = parseTime(timeInput);
        if (totalSeconds > 0 && timeInput.length >= 4) {
            let avgPace = (unit === 'miles') ? totalSeconds / 3.10686 : totalSeconds / 5.0; 
            let f = (unit === 'miles') ? 1 : 0.621371;
            setPaces({
                interval: avgPace - (10 * f), threshold: avgPace + (20 * f), tempo: avgPace + (40 * f),
                float: avgPace + (70 * f), long: avgPace + (105 * f), easy: (avgPace + (105 * f)) - (10 * f), 
                warmup: (avgPace + (105 * f)) + (30 * f), level: getAbilityLevel(totalSeconds, gender)
            });
        } else { setPaces(null); }
        
        localStorage.setItem('11thMilePrefs', JSON.stringify({ time: timeInput, gender, unit, plan }));
    }, [timeInput, unit, gender, plan]);

    const handleTimeInput = (e) => {
        let val = e.target.value.replace(/\D/g, ''); 
        if (val.length > 4) val = val.slice(0, 4); 
        if (val.length > 2) val = val.slice(0, 2) + ':' + val.slice(2); 
        setTimeInput(val);
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
                            <div onClick={() => setInfoModalSession(sess)}>
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
            <header>
                <h1 className="logo">The 11th Mile</h1>
                <div className="sub-logo">Performance Laboratory // England</div>
            </header>

            <div className="container">
                <p className="intro-text">
                    Enter your 5k time in the box below and see your guided pace. Select a range of different training sessions and get tailored times that suit you based on the time you enter.
                </p>

                <div className="dashboard">
                    <div className="sidebar">
                        <div className="input-group" style={{ textAlign: 'center', marginBottom: '30px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px' }}>
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
                                    <button className="action-btn" onClick={logInWithGoogle} style={{ background: 'white', color: 'var(--primary)', marginTop: '0' }}>
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
                            <button className="action-btn" onClick={() => setUnit(unit === 'miles' ? 'km' : 'miles')}>
                                Switch to {unit === 'miles' ? 'KM' : 'Miles'}
                            </button>
                        </div>
                        
                        {paces && (
                            <div className="results-box" style={{ display: 'block' }}>
                                <div className="tier-badge">{paces.level}</div>
                                <div className="res-row"><span className="res-label" style={{color:'var(--accent)'}}>Warm Up / Cool Down</span><span className="res-val">{formatTime(paces.warmup)}{unit==='miles'?' /mi':' /km'}</span></div>
                                <div className="res-row"><span className="res-label">Easy Run</span><span className="res-val">Max {formatTime(paces.easy)}{unit==='miles'?' /mi':' /km'}</span></div>
                                <div className="res-row"><span className="res-label">Long Run</span><span className="res-val">Conversation Pace</span></div>
                                <div className="res-row"><span className="res-label">Tempo</span><span className="res-val">{formatTime(paces.tempo)}{unit==='miles'?' /mi':' /km'}</span></div>
                                <div className="res-row"><span className="res-label">Threshold</span><span className="res-val">{formatTime(paces.threshold)}{unit==='miles'?' /mi':' /km'}</span></div>
                                <div className="res-row"><span className="res-label">Intervals</span><span className="res-val">{formatTime(paces.interval)}{unit==='miles'?' /mi':' /km'}</span></div>
                            </div>
                        )}
                        <button className="action-btn plan-btn" onClick={() => setIsPlanSetupOpen(true)}>Create Training Plan</button>
                    </div>

                    <button className="action-btn plan-btn plan-btn-mobile-fix" onClick={() => setIsPlanSetupOpen(true)} style={{display:'none'}}>Create Training Plan</button>

                    <div className="main-content">
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
                                <div className="session-grid">
                                    {sessions
                                        .filter(s => activeFilter === 'all' || s.category === activeFilter)
                                        .sort((a,b) => sortMode === 1 ? a.distanceVal - b.distanceVal : sortMode === 2 ? b.distanceVal - a.distanceVal : 0)
                                        .map(session => {
                                            let diffClass = "difficulty " + (session.difficulty.includes("Hard") || session.difficulty.includes("Max") ? "diff-hard" : session.difficulty.includes("Medium") || session.difficulty.includes("Moderate") ? "diff-med" : "diff-easy");
                                            return (
                                                <div key={session.id} className="session-card" onClick={() => setInfoModalSession(session)}>
                                                    <div className={`card-header ${session.bgClass}`}><span className="tag">{session.category}</span><h3 className="card-title">{formatTextForUnit(session.title)}</h3></div>
                                                    <div className="card-body"><span className={diffClass} style={{color: session.diffColor}}>{session.difficulty}</span><div className="card-divider"></div><p className="card-summary">{formatTextForUnit(session.summary)}</p></div>
                                                </div>
                                            );
                                        })
                                    }
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
                                <h2 style={{margin:'5px 0 0 0', color:'var(--primary)'}}>{formatTextForUnit(sData.title)}</h2>
                                <div style={{fontSize:'0.85rem', color:'#636e72', marginTop:'5px', fontWeight:500}}>{sData.category}</div>
                            </div>
                            <div className="modal-body">
                                
                                {/* MISSING 5K TIME WARNING */}
                                {!paces && (
                                    <div style={{background: '#fff3cd', color: '#d63031', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #ffeaa7', lineHeight: '1.4'}}>
                                        ⚠️ Please enter your 5K time on the main dashboard to unlock your personalized running paces for this session!
                                    </div>
                                )}

                                {sData.sessionDetail && (
                                    <div style={{marginBottom: '20px'}}>
                                        <h4 style={{margin:'0 0 5px 0', textTransform:'uppercase', color:'#b2bec3', fontSize:'0.8rem'}}>Session</h4>
                                        <div style={{fontWeight: '700', color: 'var(--primary)', fontSize: '1rem'}} dangerouslySetInnerHTML={{__html: parsePaces(sData.sessionDetail)}}></div>
                                    </div>
                                )}
                                {sData.recoveryDetail && (
                                    <div style={{marginBottom: '20px'}}>
                                        <h4 style={{margin:'0 0 5px 0', textTransform:'uppercase', color:'#b2bec3', fontSize:'0.8rem'}}>Recovery</h4>
                                        <div style={{color: 'var(--text-dark)'}} dangerouslySetInnerHTML={{__html: parsePaces(sData.recoveryDetail)}}></div>
                                    </div>
                                )}
                                {sData.breakdown && (
                                    <div style={{marginBottom: '20px'}}>
                                        <h4 style={{margin:'0 0 5px 0', textTransform:'uppercase', color:'#b2bec3', fontSize:'0.8rem'}}>Breakdown</h4>
                                        <div style={{color: 'var(--text-dark)', lineHeight: '1.6'}} dangerouslySetInnerHTML={{__html: parsePaces(sData.breakdown)}}></div>
                                    </div>
                                )}
                                {sData.pacesList && sData.pacesList.length > 0 && (
                                    <div style={{marginBottom: '20px'}}>
                                        <h4 style={{margin:'0 0 5px 0', textTransform:'uppercase', color:'#b2bec3', fontSize:'0.8rem'}}>Pace</h4>
                                        <div style={{color: 'var(--text-dark)', lineHeight: '1.6'}}>
                                            {sData.pacesList.map((p, idx) => (
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