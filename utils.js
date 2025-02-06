// Uživatelské funkce (helpery)

// Ukládání skóre
export function saveScore(name, score) {
    const scores = JSON.parse(localStorage.getItem("highScores")) || [];
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem("highScores", JSON.stringify(scores.slice(0, 10))); // Top 10
}
