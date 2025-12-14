// Loan Management System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loanForm = document.getElementById('loanForm');
    const resultsSection = document.getElementById('resultsSection');
    const exportBtn = document.getElementById('exportBtn');
    const printBtn = document.getElementById('printBtn');

    // Handle form submission
    loanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateLoan();
    });

    // Export to CSV
    exportBtn.addEventListener('click', function() {
        exportToCSV();
    });

    // Print schedule
    printBtn.addEventListener('click', function() {
        window.print();
    });

    function calculateLoan() {
        // Get form values
        const loanAmount = parseFloat(document.getElementById('loanAmount').value);
        const annualInterestRate = parseFloat(document.getElementById('interestRate').value);
        const loanTermYears = parseFloat(document.getElementById('loanTerm').value);
        const paymentsPerYear = parseInt(document.getElementById('paymentFrequency').value);

        // Validate inputs
        if (isNaN(loanAmount) || isNaN(annualInterestRate) || isNaN(loanTermYears)) {
            alert('Please enter valid numbers for all fields.');
            return;
        }

        // Calculate loan details
        const monthlyInterestRate = (annualInterestRate / 100) / paymentsPerYear;
        const numberOfPayments = loanTermYears * paymentsPerYear;

        // Calculate monthly payment using the loan payment formula
        let monthlyPayment;
        if (monthlyInterestRate === 0) {
            monthlyPayment = loanAmount / numberOfPayments;
        } else {
            monthlyPayment = loanAmount * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        }

        // Calculate total payment and total interest
        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - loanAmount;

        // Display summary
        document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
        document.getElementById('totalPayment').textContent = formatCurrency(totalPayment);
        document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
        document.getElementById('numberOfPayments').textContent = numberOfPayments;

        // Generate payment schedule
        generatePaymentSchedule(loanAmount, monthlyInterestRate, monthlyPayment, numberOfPayments);

        // Show results section
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function generatePaymentSchedule(principal, monthlyRate, monthlyPayment, numberOfPayments) {
        const tableBody = document.getElementById('paymentTableBody');
        tableBody.innerHTML = '';

        let remainingBalance = principal;
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() + 1);

        // Store schedule data for CSV export
        window.loanScheduleData = [];

        for (let i = 1; i <= numberOfPayments; i++) {
            // Calculate interest for this payment
            const interestPayment = remainingBalance * monthlyRate;
            
            // Calculate principal payment
            const principalPayment = monthlyPayment - interestPayment;
            
            // Update remaining balance
            remainingBalance = Math.max(0, remainingBalance - principalPayment);

            // Calculate payment date
            const paymentDate = new Date(startDate);
            const paymentsPerYear = parseInt(document.getElementById('paymentFrequency').value);
            
            if (paymentsPerYear === 12) {
                paymentDate.setMonth(startDate.getMonth() + (i - 1));
            } else if (paymentsPerYear === 24) {
                paymentDate.setDate(startDate.getDate() + ((i - 1) * 14));
            } else if (paymentsPerYear === 52) {
                paymentDate.setDate(startDate.getDate() + ((i - 1) * 7));
            } else if (paymentsPerYear === 4) {
                paymentDate.setMonth(startDate.getMonth() + ((i - 1) * 3));
            }

            // Create table row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${i}</td>
                <td>${formatDate(paymentDate)}</td>
                <td>${formatCurrency(principalPayment)}</td>
                <td>${formatCurrency(interestPayment)}</td>
                <td>${formatCurrency(monthlyPayment)}</td>
                <td>${formatCurrency(remainingBalance)}</td>
            `;
            tableBody.appendChild(row);

            // Store data for CSV
            window.loanScheduleData.push({
                paymentNumber: i,
                date: formatDate(paymentDate),
                principal: principalPayment,
                interest: interestPayment,
                total: monthlyPayment,
                balance: remainingBalance
            });
        }
    }

    function formatCurrency(amount) {
        return 'R ' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function formatDate(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    function exportToCSV() {
        if (!window.loanScheduleData || window.loanScheduleData.length === 0) {
            alert('No payment schedule data to export.');
            return;
        }

        // Get loan summary data
        const loanAmount = document.getElementById('loanAmount').value;
        const interestRate = document.getElementById('interestRate').value;
        const loanTerm = document.getElementById('loanTerm').value;
        const monthlyPayment = document.getElementById('monthlyPayment').textContent;
        const totalPayment = document.getElementById('totalPayment').textContent;
        const totalInterest = document.getElementById('totalInterest').textContent;

        // Create CSV content
        let csvContent = 'Loan Management System - Payment Schedule\n\n';
        csvContent += 'Loan Summary\n';
        csvContent += `Loan Amount,${loanAmount}\n`;
        csvContent += `Interest Rate,${interestRate}%\n`;
        csvContent += `Loan Term,${loanTerm} years\n`;
        csvContent += `Monthly Payment,${monthlyPayment}\n`;
        csvContent += `Total Payment,${totalPayment}\n`;
        csvContent += `Total Interest,${totalInterest}\n\n`;
        csvContent += 'Payment Schedule\n';
        csvContent += 'Payment #,Date,Principal,Interest,Total Payment,Remaining Balance\n';

        // Add payment schedule data
        window.loanScheduleData.forEach(payment => {
            csvContent += `${payment.paymentNumber},${payment.date},${payment.principal.toFixed(2)},${payment.interest.toFixed(2)},${payment.total.toFixed(2)},${payment.balance.toFixed(2)}\n`;
        });

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `loan_schedule_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

