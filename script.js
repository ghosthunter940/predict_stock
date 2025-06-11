// Global Variables
let currentMode = 'year';
let dataCount = 4;
let inputData = [];
let newtonGregoryTable = [];
let predictionResult = null;

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const dataCountSelect = document.getElementById('dataCount');
const dataInputsContainer = document.getElementById('dataInputs');
const resultsSection = document.getElementById('resultsSection');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    generateInputFields();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Data count change
    dataCountSelect.addEventListener('change', function() {
        dataCount = parseInt(this.value);
        generateInputFields();
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

// Mode Selection
function setMode(mode) {
    currentMode = mode;
    
    // Update UI
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (mode === 'year') {
        document.getElementById('yearMode').classList.add('active');
        document.getElementById('predictLabel').textContent = 'Tahun:';
        document.getElementById('predictValue').placeholder = 'Masukkan tahun yang ingin diprediksi';
        document.getElementById('predictValue').type = 'number';
        document.getElementById('timeHeader').textContent = 'Tahun';
    } else {
        document.getElementById('dateMode').classList.add('active');
        document.getElementById('predictLabel').textContent = 'Tanggal:';
        document.getElementById('predictValue').placeholder = 'Pilih tanggal yang ingin diprediksi';
        document.getElementById('predictValue').type = 'date';
        document.getElementById('timeHeader').textContent = 'Tanggal';
    }
    
    generateInputFields();
}

// Generate Input Fields
function generateInputFields() {
    dataInputsContainer.innerHTML = '';
    
    for (let i = 0; i < dataCount; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        
        if (currentMode === 'year') {
            // Year mode - keep using number input
            inputGroup.innerHTML = `
                <label for="time_${i}">Tahun ${i + 1}:</label>
                <input type="number" id="time_${i}" placeholder="Contoh: 2020" min="1900" max="2100" required>
                <label for="price_${i}">Harga Saham ${i + 1}:</label>
                <input type="number" id="price_${i}" placeholder="Contoh: 5500" step="0.01" min="0" required>
            `;
        } else {
            // Date mode - use date picker
            inputGroup.innerHTML = `
                <label for="time_${i}">Tanggal ${i + 1}:</label>
                <input type="date" id="time_${i}" required>
                <label for="price_${i}">Harga Saham ${i + 1}:</label>
                <input type="number" id="price_${i}" placeholder="Contoh: 5500" step="0.01" min="0" required>
            `;
        }
        
        dataInputsContainer.appendChild(inputGroup);
    }
}

// Scroll to Section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Validate Input Data
function validateInputData() {
    const errors = [];
    inputData = [];
    
    // Collect and validate data
    for (let i = 0; i < dataCount; i++) {
        const timeInput = document.getElementById(`time_${i}`);
        const priceInput = document.getElementById(`price_${i}`);
        
        const timeValue = timeInput.value.trim();
        const priceValue = parseFloat(priceInput.value);
        
        // Reset error states
        timeInput.classList.remove('input-error');
        priceInput.classList.remove('input-error');
        
        if (!timeValue) {
            errors.push(`${currentMode === 'year' ? 'Tahun' : 'Tanggal'} ${i + 1} harus diisi`);
            timeInput.classList.add('input-error');
        }
        
        if (isNaN(priceValue) || priceValue <= 0) {
            errors.push(`Harga saham ${i + 1} harus berupa angka positif`);
            priceInput.classList.add('input-error');
        }
        
        if (timeValue && !isNaN(priceValue) && priceValue > 0) {
            if (currentMode === 'year') {
                const yearValue = parseInt(timeValue);
                if (yearValue < 1900 || yearValue > 2100) {
                    errors.push(`Tahun ${i + 1} harus antara 1900-2100`);
                    timeInput.classList.add('input-error');
                } else {
                    inputData.push({
                        time: yearValue,
                        price: priceValue
                    });
                }
            } else {
                // Validate date format
                const dateValue = new Date(timeValue);
                if (isNaN(dateValue.getTime())) {
                    errors.push(`Tanggal ${i + 1} tidak valid`);
                    timeInput.classList.add('input-error');
                } else {
                    inputData.push({
                        time: timeValue,
                        price: priceValue
                    });
                }
            }
        }
    }
    
    // Check prediction value
    const predictValue = document.getElementById('predictValue').value.trim();
    if (!predictValue) {
        errors.push('Nilai yang ingin diprediksi harus diisi');
        document.getElementById('predictValue').classList.add('input-error');
    } else {
        // Validate prediction value based on mode
        if (currentMode === 'year') {
            const predictYear = parseInt(predictValue);
            if (isNaN(predictYear) || predictYear < 1900 || predictYear > 2100) {
                errors.push('Tahun prediksi harus antara 1900-2100');
                document.getElementById('predictValue').classList.add('input-error');
            }
        } else {
            const predictDate = new Date(predictValue);
            if (isNaN(predictDate.getTime())) {
                errors.push('Tanggal prediksi tidak valid');
                document.getElementById('predictValue').classList.add('input-error');
            }
        }
    }
    
    // Check for duplicate time values
    if (currentMode === 'year') {
        const times = inputData.map(d => d.time);
        const uniqueTimes = [...new Set(times)];
        if (times.length !== uniqueTimes.length) {
            errors.push('Tahun tidak boleh duplikat');
        }
        
        // Sort by year for proper interpolation
        inputData.sort((a, b) => a.time - b.time);
        
        // Check if data is sequential or has reasonable gaps
        for (let i = 1; i < inputData.length; i++) {
            if (inputData[i].time <= inputData[i-1].time) {
                errors.push('Data tahun harus berurutan dan tidak duplikat');
                break;
            }
        }
    } else {
        // For date mode, sort by date and check for duplicates
        const times = inputData.map(d => d.time);
        const uniqueTimes = [...new Set(times)];
        if (times.length !== uniqueTimes.length) {
            errors.push('Tanggal tidak boleh duplikat');
        }
        
        // Sort by date for proper interpolation
        inputData.sort((a, b) => new Date(a.time) - new Date(b.time));
        
        // Check for duplicate dates after sorting
        for (let i = 1; i < inputData.length; i++) {
            if (new Date(inputData[i].time).getTime() <= new Date(inputData[i-1].time).getTime()) {
                errors.push('Data tanggal harus berurutan dan tidak duplikat');
                break;
            }
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors,
        predictValue: predictValue
    };
}

// Calculate Newton-Gregory Forward Interpolation
function calculateNewtonGregory(data, targetTime) {
    const n = data.length;
    const table = [];
    
    // Initialize first column with y values
    for (let i = 0; i < n; i++) {
        table[i] = [data[i].price];
    }
    
    // Calculate forward differences
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            const diff = table[i + 1][j - 1] - table[i][j - 1];
            table[i][j] = diff;
        }
    }
    
    // Calculate u value
    let u;
    
    if (currentMode === 'year') {
        const baseYear = data[0].time;
        const targetYear = parseInt(targetTime);
        u = targetYear - baseYear;
    } else {
        // For date mode, calculate difference in days
        const baseDate = new Date(data[0].time);
        const targetDate = new Date(targetTime);
        const diffTime = targetDate - baseDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Calculate average interval in days
        let totalInterval = 0;
        for (let i = 1; i < data.length; i++) {
            const prevDate = new Date(data[i-1].time);
            const currDate = new Date(data[i].time);
            totalInterval += (currDate - prevDate) / (1000 * 60 * 60 * 24);
        }
        const avgInterval = totalInterval / (data.length - 1);
        
        u = diffDays / avgInterval;
    }
    
    // Newton-Gregory Forward formula
    let result = table[0][0]; // y0
    let uTerm = u;
    let factorial = 1;
    
    for (let i = 1; i < n; i++) {
        factorial *= i;
        result += (uTerm * table[0][i]) / factorial;
        uTerm *= (u - i);
    }
    
    return {
        table: table,
        result: result,
        uValue: u
    };
}

// Calculate Prediction
function calculatePrediction() {
    const validation = validateInputData();
    
    if (!validation.isValid) {
        alert('Error:\n' + validation.errors.join('\n'));
        return;
    }
    
    try {
        // Show loading state
        const calculateBtn = document.querySelector('.calculate-btn');
        const originalText = calculateBtn.innerHTML;
        calculateBtn.innerHTML = '<div class="loading"></div> Menghitung...';
        calculateBtn.disabled = true;
        
        setTimeout(() => {
            // Perform calculation
            const calculation = calculateNewtonGregory(inputData, validation.predictValue);
            
            // Store results
            newtonGregoryTable = calculation.table;
            predictionResult = {
                value: calculation.result,
                uValue: calculation.uValue,
                targetTime: validation.predictValue
            };
            
            // Display results
            displayInputTable();
            displayNewtonTable();
            displayPredictionResult();
            
            // Show results section
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Reset button
            calculateBtn.innerHTML = originalText;
            calculateBtn.disabled = false;
            
            // Remove error states
            document.querySelectorAll('.input-error').forEach(input => {
                input.classList.remove('input-error');
            });
            
        }, 1000);
        
    } catch (error) {
        console.error('Calculation error:', error);
        alert('Terjadi kesalahan dalam perhitungan. Silakan periksa data input Anda.');
        
        // Reset button
        const calculateBtn = document.querySelector('.calculate-btn');
        calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Hitung Prediksi';
        calculateBtn.disabled = false;
    }
}

// Display Input Table
function displayInputTable() {
    const tbody = document.getElementById('inputTableBody');
    tbody.innerHTML = '';
    
    inputData.forEach((data, index) => {
        const row = document.createElement('tr');
        const timeDisplay = currentMode === 'year' ? data.time : formatDate(data.time);
        const priceDisplay = formatCurrency(data.price);
        
        row.innerHTML = `
            <td>${timeDisplay}</td>
            <td>${priceDisplay}</td>
        `;
        tbody.appendChild(row);
    });
}

// Display Newton-Gregory Table
function displayNewtonTable() {
    const thead = document.getElementById('newtonTableHead');
    const tbody = document.getElementById('newtonTableBody');
    
    // Clear existing content
    thead.innerHTML = '';
    tbody.innerHTML = '';
    
    // Create header
    const headerRow = document.createElement('tr');
    const timeLabel = currentMode === 'year' ? 'Tahun' : 'Tanggal';
    headerRow.innerHTML = `<th>${timeLabel}</th><th>y</th>`;
    
    for (let i = 1; i < newtonGregoryTable[0].length; i++) {
        headerRow.innerHTML += `<th>Δ<sup>${i}</sup>y</th>`;
    }
    thead.appendChild(headerRow);
    
    // Create body rows
    for (let i = 0; i < newtonGregoryTable.length; i++) {
        const row = document.createElement('tr');
        const timeDisplay = currentMode === 'year' ? inputData[i].time : formatDate(inputData[i].time);
        
        row.innerHTML = `<td>${timeDisplay}</td>`;
        
        for (let j = 0; j < newtonGregoryTable[i].length; j++) {
            const value = newtonGregoryTable[i][j];
            const cellContent = value !== undefined ? formatNumber(value) : '-';
            row.innerHTML += `<td>${cellContent}</td>`;
        }
        
        tbody.appendChild(row);
    }
}

// Display Prediction Result
function displayPredictionResult() {
    const predictionValueElement = document.getElementById('predictionValue');
    const uValueElement = document.getElementById('uValue');
    const trendValueElement = document.getElementById('trendValue');
    
    // Format prediction value
    predictionValueElement.textContent = formatNumber(predictionResult.value);
    
    // Display u value
    uValueElement.textContent = formatNumber(predictionResult.uValue);
    
    // Calculate and display trend
    const lastPrice = inputData[inputData.length - 1].price;
    const predictedPrice = predictionResult.value;
    const trend = predictedPrice > lastPrice ? 'Naik' : predictedPrice < lastPrice ? 'Turun' : 'Stabil';
    
    trendValueElement.textContent = trend;
    trendValueElement.className = 'trend-badge';
    
    if (trend === 'Naik') {
        trendValueElement.classList.add('trend-up');
    } else if (trend === 'Turun') {
        trendValueElement.classList.add('trend-down');
    }
}

// Utility Functions
function formatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) return '-';
    return num.toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatCurrency(num) {
    if (typeof num !== 'number' || isNaN(num)) return '-';
    return 'Rp ' + num.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.result-card');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Add scroll event listener for animations
window.addEventListener('scroll', animateOnScroll);

// Initialize animations on load
window.addEventListener('load', animateOnScroll);

// Add some sample data for demonstration
function loadSampleData() {
    if (currentMode === 'year') {
        const sampleData = [
            { year: 2020, price: 5500 },
            { year: 2021, price: 6700 },
            { year: 2022, price: 7000 },
            { year: 2023, price: 7500 }
        ];
        
        sampleData.forEach((data, index) => {
            if (index < dataCount) {
                document.getElementById(`time_${index}`).value = data.year;
                document.getElementById(`price_${index}`).value = data.price;
            }
        });
        
        document.getElementById('predictValue').value = '2024';
    } else {
        // Sample data for date mode
        const sampleData = [
            { date: '2023-01-01', price: 5500 },
            { date: '2023-04-01', price: 6700 },
            { date: '2023-07-01', price: 7000 },
            { date: '2023-10-01', price: 7500 }
        ];
        
        sampleData.forEach((data, index) => {
            if (index < dataCount) {
                document.getElementById(`time_${index}`).value = data.date;
                document.getElementById(`price_${index}`).value = data.price;
            }
        });
        
        document.getElementById('predictValue').value = '2024-01-01';
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Enter key to calculate
    if (event.key === 'Enter' && event.ctrlKey) {
        calculatePrediction();
    }
    
    // Escape key to clear results
    if (event.key === 'Escape') {
        resultsSection.style.display = 'none';
    }
});

// Add sample data button functionality (you can add this button to HTML if needed)
function addSampleDataButton() {
    const sampleBtn = document.createElement('button');
    sampleBtn.textContent = 'Load Sample Data';
    sampleBtn.className = 'sample-btn';
    sampleBtn.style.cssText = `
        background: #6b7280;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        margin-left: 10px;
        font-size: 0.9rem;
    `;
    sampleBtn.onclick = loadSampleData;
    
    const inputHeader = document.querySelector('.input-header');
    inputHeader.appendChild(sampleBtn);
}

// Call this function after DOM is loaded if you want the sample data button
// addSampleDataButton();

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateNewtonGregory,
        validateInputData,
        formatNumber,
        formatCurrency
    };
}