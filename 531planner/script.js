import { calculateWeights } from './utils.js';
import { showElement, hideElement } from './domUtils.js';

let trainingMaxes = {};

// Function to save the current input values to localStorage
function saveInputValues() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        localStorage.setItem(input.id, input.value);
    });
}

// Function to load saved input values from localStorage
function loadInputValues() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        const savedValue = localStorage.getItem(input.id);
        if (savedValue !== null) {
            input.value = savedValue;
        }
    });
}

function generateTable() {
    const squatMax = parseFloat(document.getElementById("squatMax").value);
    const sldlMax = parseFloat(document.getElementById("sldlMax").value);
    const benchMax = parseFloat(document.getElementById("benchMax").value);
    const inclineMax = parseFloat(document.getElementById("inclineMax").value);
    const deadliftMax = parseFloat(document.getElementById("deadliftMax").value);
    const zercherMax = parseFloat(document.getElementById("zercherMax").value);
    const pressMax = parseFloat(document.getElementById("pressMax").value);
    const closeGripMax = parseFloat(document.getElementById("closeGripMax").value);

    trainingMaxes = {
        Squat: squatMax * 0.9,
        SLDL: sldlMax * 0.9,
        Bench: benchMax * 0.9,
        Incline: inclineMax * 0.9,
        Deadlift: deadliftMax * 0.9,
        Zercher: zercherMax * 0.9,
        Press: pressMax * 0.9,
        CloseGrip: closeGripMax * 0.9
    };

    updateTable(trainingMaxes);
    saveTableData();
}

function updateTable(maxes) {
    const percentages = {
        Week1: [0.65, 0.75, 0.85],
        Week2: [0.70, 0.80, 0.90],
        Week3: [0.75, 0.85, 0.95],
        Deload: [0.40, 0.50, 0.60]
    };

    const secondaryPercentages = {
        Week1: [0.50, 0.60, 0.70],
        Week2: [0.60, 0.70, 0.80],
        Week3: [0.65, 0.75, 0.85],
        Deload: [0.40, 0.50, 0.60]
    };

    const tableBody = document.querySelector("#resultsTable tbody");
    tableBody.innerHTML = ''; // Clear previous results

    function createRow(primary, primaryMax, secondary, secondaryMax, assistance) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${primary} (${primaryMax.toFixed(1)} kg) & ${secondary} (${secondaryMax.toFixed(1)} kg)
                <div class="small-text">${assistance}</div>
            </td>
            <td>
                ${primary}: ${calculateWeights(maxes[primary], percentages.Week1).join(', ')} kg<br>
                ${secondary}: ${calculateWeights(maxes[secondary], secondaryPercentages.Week1).join(', ')} kg
            </td>
            <td>
                ${primary}: ${calculateWeights(maxes[primary], percentages.Week2).join(', ')} kg<br>
                ${secondary}: ${calculateWeights(maxes[secondary], secondaryPercentages.Week2).join(', ')} kg
            </td>
            <td>
                ${primary}: ${calculateWeights(maxes[primary], percentages.Week3).join(', ')} kg<br>
                ${secondary}: ${calculateWeights(maxes[secondary], secondaryPercentages.Week3).join(', ')} kg
            </td>
            <td>
                ${primary}: ${calculateWeights(maxes[primary], percentages.Deload).join(', ')} kg<br>
                ${secondary}: ${calculateWeights(maxes[secondary], secondaryPercentages.Deload).join(', ')} kg
            </td>
        `;
        return row;
    }

    // Append the rows with the correct data
    tableBody.appendChild(createRow("Squat", maxes.Squat / 0.9, "SLDL", maxes.SLDL / 0.9, "Hamstrings, Lower Back, Abs"));
    tableBody.appendChild(createRow("Bench", maxes.Bench / 0.9, "Incline", maxes.Incline / 0.9, "Lats, Upper Back, Triceps, Biceps"));
    tableBody.appendChild(createRow("Deadlift", maxes.Deadlift / 0.9, "Zercher", maxes.Zercher / 0.9, "Hamstrings, Lower Back, Abs"));
    tableBody.appendChild(createRow("Press", maxes.Press / 0.9, "CloseGrip", maxes.CloseGrip / 0.9, "Lats, Upper Back, Triceps, Biceps"));
}

function saveTableData() {
    localStorage.setItem('trainingMaxes', JSON.stringify(trainingMaxes));
}

function loadTableData() {
    const savedMaxes = localStorage.getItem('trainingMaxes');
    if (savedMaxes) {
        trainingMaxes = JSON.parse(savedMaxes);
        updateTable(trainingMaxes);
    }
}

function updateForNextCycle() {
    // Increase the input values directly
    document.getElementById("squatMax").value = parseFloat(document.getElementById("squatMax").value) + 5;
    document.getElementById("sldlMax").value = parseFloat(document.getElementById("sldlMax").value) + 5;
    document.getElementById("deadliftMax").value = parseFloat(document.getElementById("deadliftMax").value) + 5;
    document.getElementById("zercherMax").value = parseFloat(document.getElementById("zercherMax").value) + 5;

    document.getElementById("benchMax").value = parseFloat(document.getElementById("benchMax").value) + 2.5;
    document.getElementById("inclineMax").value = parseFloat(document.getElementById("inclineMax").value) + 2.5;
    document.getElementById("pressMax").value = parseFloat(document.getElementById("pressMax").value) + 2.5;
    document.getElementById("closeGripMax").value = parseFloat(document.getElementById("closeGripMax").value) + 2.5;

    // Save the updated input values
    saveInputValues();

    // Regenerate the table with updated values
    generateTable();
}

function resetValues() {
    // Confirm the reset action
    if (confirm("Are you sure you want to reset all values to zero?")) {
        // Reset all input values to zero
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = 0;
        });

        // Save the reset input values
        saveInputValues();

        // Regenerate the table with zeroed values
        generateTable();
    }
}

// Event listener for saving the table as an image
document.getElementById('saveTableButton').addEventListener('click', function() {
    const table = document.getElementById('resultsTable');

    html2canvas(table).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'workout-program.png';
        link.click();
    });
});

// Event listener for updating to the next cycle
document.getElementById('nextCycleButton').addEventListener('click', updateForNextCycle);

// Event listener for resetting the values to zero
document.getElementById('resetButton').addEventListener('click', resetValues);

// Save input values whenever they change
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', saveInputValues);
});

window.generateTable = generateTable;

// Load saved input values and table data on page load
window.addEventListener('load', () => {
    loadInputValues();
    loadTableData();
});