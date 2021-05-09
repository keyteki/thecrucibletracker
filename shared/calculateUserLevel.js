module.exports = ({ games, achievements, user }) => {
    const numAchievementsCompleted = achievements.filter((n) => n.date_awarded_on).length;
    const numWins = games.filter((g) => g.winner === user).length;
    const numLosses = games.filter((g) => g.winner !== user).length;
    const totalPoints = numAchievementsCompleted * 7 + numWins * 2 + numLosses;

    let level = 1;
    let totalCost = 0;
    let previousCost = 0;
    let remainingPoints = totalPoints;
    let progress = 0;
    for (let i = 0; i < 1000; i++) {
        const costForNextLevel = Math.max(5, i);

        let costMultiplier = 0.25;
        if (level > 50) {
            costMultiplier = 0.4;
        }

        const pointsNeeded = Math.floor(previousCost * costMultiplier + costForNextLevel);
        totalCost += pointsNeeded;

        if (remainingPoints > pointsNeeded) {
            remainingPoints -= pointsNeeded;
            level += 1;
        } else if (!progress) {
            progress = remainingPoints / pointsNeeded;
        }

        previousCost = pointsNeeded;
    }

    return {
        level,
        progress
    };
};
