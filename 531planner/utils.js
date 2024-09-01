// utils.js
export function calculateWeights(max, percentages) {
    return percentages.map(p => {
        let weight = max * p;
        return Math.round(weight / 5) * 5;  // Round to nearest 2.5 kg
    });
}