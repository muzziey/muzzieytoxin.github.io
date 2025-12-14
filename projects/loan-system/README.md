# Loan Management System

A comprehensive web-based loan calculator and payment schedule generator built with HTML, CSS, and JavaScript.

## Features

- **Loan Calculator**: Calculate monthly payments, total payment, and total interest
- **Flexible Payment Frequencies**: Support for monthly, bi-weekly, weekly, and quarterly payments
- **Detailed Payment Schedule**: View complete amortization schedule with principal, interest, and remaining balance for each payment
- **Export Functionality**: Export payment schedule to CSV format
- **Print Support**: Print-friendly payment schedule
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## How to Use

1. Open `index.html` in a web browser
2. Enter the following information:
   - **Loan Amount**: The total amount you want to borrow
   - **Annual Interest Rate**: The yearly interest rate percentage
   - **Loan Term**: Number of years for the loan
   - **Payment Frequency**: Choose how often you'll make payments
3. Click "Calculate Loan" to see results
4. View the detailed payment schedule
5. Export to CSV or print the schedule as needed

## Files Structure

```
loan-system/
├── index.html      # Main HTML file
├── style.css       # Styling and layout
├── script.js       # Loan calculation logic
└── README.md       # Documentation
```

## Calculation Formula

The system uses the standard loan payment formula:

**Monthly Payment = P × [r(1 + r)^n] / [(1 + r)^n - 1]**

Where:
- P = Principal (loan amount)
- r = Monthly interest rate (annual rate / 12)
- n = Total number of payments

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons

## License

This project is open source and available for personal and commercial use.

## Author

Created as part of portfolio projects.

---

For questions or support, please refer to the documentation or contact the developer.

