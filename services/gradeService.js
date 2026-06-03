/**
 * Calculates the best 5 total out of 6 subjects.
 * @param {number[]} marks - Array of 6 subject marks
 * @returns {number} The sum of the highest 5 marks
 */
const calculateBest5Total = (marks) => {
    // Sort descending
    const sortedMarks = [...marks].sort((a, b) => b - a);
    // Take top 5 and sum
    let total = 0;
    for (let i = 0; i < 5; i++) {
        total += sortedMarks[i];
    }
    return total;
};

/**
 * Calculates the percentage based on the best 5 total (out of 500).
 * @param {number} best5Total - Total of best 5 subjects
 * @returns {number} Percentage
 */
const calculatePercentage = (best5Total) => {
    return (best5Total / 500) * 100;
};

/**
 * Determines the grade based on percentage.
 * @param {number} percentage - The calculated percentage
 * @returns {string} Grade
 */
const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'D';
};

module.exports = {
    calculateBest5Total,
    calculatePercentage,
    calculateGrade
};
