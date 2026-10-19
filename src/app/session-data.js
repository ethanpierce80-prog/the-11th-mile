export const sessionTypes = {
    short_interval: [10, 12, 16, 17, 25, 41, 45],
    long_interval: [3, 11, 15, 40, 42, 44],
    tempo: [2, 5, 6, 9, 18, 19, 20, 24, 38, 39],
    fartlek: [4, 7, 8, 13, 14, 21, 22, 23],
    long_run: [29, 30, 31, 32, 33, 34, 35, 36, 37, 43],
    easy: [26, 27, 28]
};

export const sessions = [
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

export const sessionCategories = [
    {
        slug: 'time-trials',
        category: 'Time Trial',
        title: '5K Time Trials',
        description: 'Pace a 5K effort and use a time trial to understand your current running fitness.',
        introduction: 'A time trial is a measured hard effort that helps runners assess current fitness. Warm up properly, choose a safe route, and aim for an even effort rather than starting too fast.'
    },
    {
        slug: 'tempo-sessions',
        category: 'Tempo',
        title: 'Tempo Running Sessions',
        description: 'Explore tempo workouts that help develop sustained, comfortably hard running.',
        introduction: 'Tempo sessions build the ability to hold a controlled, challenging pace. These workouts range from progressive runs to alternating faster and easier segments.'
    },
    {
        slug: 'interval-sessions',
        category: 'Interval',
        title: 'Interval Running Sessions',
        description: 'Browse structured running intervals with varied distances, paces, and recoveries.',
        introduction: 'Interval sessions alternate faster running with recovery. The library includes track ladders, pyramids, and mixed-distance workouts; choose a session that matches your experience and recover between hard efforts.'
    },
    {
        slug: 'fartlek-sessions',
        category: 'Fartlek',
        title: 'Fartlek Running Sessions',
        description: 'Find fartlek workouts that mix faster efforts and recovery within a continuous run.',
        introduction: 'Fartlek means “speed play”: a flexible style of training that alternates faster efforts with easier running or recovery. These sessions use timed and distance-based changes of pace.'
    },
    {
        slug: 'easy-and-long-runs',
        category: 'Easy',
        title: 'Easy and Long Runs',
        description: 'Browse easy running and long-run sessions for aerobic endurance and steady mileage.',
        introduction: 'Easy runs and long runs support aerobic endurance. Keep these efforts conversational, build distance gradually, and adjust the session to your current training and recovery.'
    }
];

export const slugify = (value) => value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const getCategoryForSession = (session) =>
    sessionCategories.find((category) => category.category === session.category);

export const getSessionUrl = (session) => {
    const category = getCategoryForSession(session);
    return `/running-sessions/${category.slug}/${slugify(session.title)}`;
};

export const matchesSessionSearch = (session, search) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    const miles = Number(session.distanceVal);
    const kilometers = (miles * 1.60934).toFixed(1).replace(/\.0$/, '');
    const categoryAliases = session.category === 'Easy' ? 'easy long easy and long' : session.category;
    const searchableText = [
        session.title,
        session.summary,
        session.category,
        categoryAliases,
        `${miles} mile ${miles} miles`,
        `${kilometers} km ${kilometers} kilometer ${kilometers} kilometers`,
        session.sessionDetail
    ].join(' ').toLowerCase();

    return query.split(/\s+/).every((term) => searchableText.includes(term));
};
