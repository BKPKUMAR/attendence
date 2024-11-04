// Function to add employee
function addEmployee() {
    const employeeName = document.getElementById('employeeName').value;
    if (employeeName.trim() === "") {
        alert("Please enter an employee name.");
        return;
    }

    let employeeList = JSON.parse(localStorage.getItem('employeeList')) || [];
    employeeList.push(employeeName);
    localStorage.setItem('employeeList', JSON.stringify(employeeList));

    document.getElementById('employeeName').value = ''; // Clear input
    displayEmployeeList();
    updateEmployeeSelect();
}

// Function to display employee list
function displayEmployeeList() {
    const employeeListDiv = document.getElementById('employeeList');
    employeeListDiv.innerHTML = '';
    const employeeList = JSON.parse(localStorage.getItem('employeeList')) || [];

    employeeList.forEach((name, index) => {
        const employeeEntry = document.createElement('div');
        employeeEntry.className = 'employee-entry';
        employeeEntry.innerHTML = `${name} <button onclick="deleteEmployee(${index})">Delete</button>`;
        employeeListDiv.appendChild(employeeEntry);
    });
}

// Function to delete employee
function deleteEmployee(index) {
    let employeeList = JSON.parse(localStorage.getItem('employeeList')) || [];
    employeeList.splice(index, 1); // Remove the employee at the specified index
    localStorage.setItem('employeeList', JSON.stringify(employeeList));
    displayEmployeeList(); // Update the displayed list
    updateEmployeeSelect(); // Update the employee dropdown
}

// Function to update employee selection dropdown
function updateEmployeeSelect() {
    const employeeSelect = document.getElementById('employeeSelect');
    const employeeList = JSON.parse(localStorage.getItem('employeeList')) || [];
    
    // Clear existing options
    employeeSelect.innerHTML = '';
    
    // Populate dropdown with current employees
    employeeList.forEach((name) => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        employeeSelect.appendChild(option);
    });
}

// Function to record attendance
function recordAttendance(type) {
    const employeeName = document.getElementById('employeeSelect').value;
    if (employeeName === "") {
        alert("Please select an employee.");
        return;
    }

    // Get the current timestamp
    const timestamp = new Date().toLocaleString();
    // Get GPS coordinates
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const gpsCoordinates = `${position.coords.latitude}, ${position.coords.longitude}`;
            const attendanceEntry = {
                type: type,
                timestamp: timestamp,
                employee: employeeName,
                gps: gpsCoordinates
            };

            saveAttendance(attendanceEntry);
            displayAttendanceLog();
        }, (error) => {
            alert("Unable to retrieve location. Attendance not recorded.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to save attendance entry
function saveAttendance(entry) {
    let attendanceLog = JSON.parse(localStorage.getItem('attendanceLog')) || [];
    attendanceLog.push(entry);
    localStorage.setItem('attendanceLog', JSON.stringify(attendanceLog));
}

// Function to display attendance log
function displayAttendanceLog() {
    const log = document.getElementById('log');
    log.innerHTML = '';
    const attendanceLog = JSON.parse(localStorage.getItem('attendanceLog')) || [];

    attendanceLog.forEach(entry => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `<strong>${entry.type}:</strong> ${entry.timestamp} - Employee: ${entry.employee} - GPS: ${entry.gps}`;
        log.appendChild(logEntry);
    });
}

// Function to export attendance to Excel
function exportToExcel() {
    const attendanceLog = JSON.parse(localStorage.getItem('attendanceLog')) || [];
    
    if (attendanceLog.length === 0) {
        alert("No attendance records to export!");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(attendanceLog);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Log");

    // Generate a download link and click it
    XLSX.writeFile(workbook, "AttendanceLog.xlsx");
}

// Display employee list and attendance log on page load
window.onload = function() {
    displayEmployeeList();
    updateEmployeeSelect();
    displayAttendanceLog();
};

