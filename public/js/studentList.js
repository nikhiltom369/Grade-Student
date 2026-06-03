document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('studentTableBody');
    const searchName = document.getElementById('searchName');
    const searchRoll = document.getElementById('searchRoll');
    const sortSelect = document.getElementById('sortSelect');
    const exportBtn = document.getElementById('exportBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');

    let allStudents = [];
    let filteredStudents = [];

    // Pagination config
    const rowsPerPage = 10;
    let currentPage = 1;

    const gradeOrder = { 'A+': 7, 'A': 6, 'B+': 5, 'B': 4, 'C+': 3, 'C': 2, 'D': 1 };

    // Logout logic
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login.html';
        });
    }

    // Fetch students from API
    async function loadStudents() {
        try {
            const response = await fetch('/api/students');
            const data = await response.json();

            if (response.status === 401) {
                window.location.href = '/login.html';
                return;
            }

            if (response.ok && data.success) {
                allStudents = data.students;
                applyFiltersAndSort();
            } else {
                showError(data.error || 'Failed to load students');
            }
        } catch (error) {
            showError('Server error while loading data.');
        }
    }

    function showError(msg) {
        errorAlert.classList.remove('d-none');
        errorMessage.innerText = msg;
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-danger">Error loading data.</td></tr>`;
    }

    // Render table
    function renderTable() {
        tableBody.innerHTML = '';
        
        const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageStudents = filteredStudents.slice(start, end);

        if (pageStudents.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No student records found.</td></tr>';
        } else {
            pageStudents.forEach(student => {
                let badgeClass = 'bg-secondary';
                if(student.grade === 'A+' || student.grade === 'A') badgeClass = 'bg-success';
                else if(student.grade === 'B+' || student.grade === 'B') badgeClass = 'bg-primary';
                else if(student.grade === 'C+' || student.grade === 'C') badgeClass = 'bg-warning text-dark';
                else if(student.grade === 'D') badgeClass = 'bg-danger';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="fw-bold text-secondary">${student.roll_no}</td>
                    <td>${student.student_name}</td>
                    <td>${student.contact_details}</td>
                    <td class="text-center">${student.percentage}%</td>
                    <td class="text-center" data-grade="${student.grade}">
                        <span class="badge ${badgeClass} px-3 py-2 fs-6 rounded-pill">${student.grade}</span>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }

        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        const nav = document.getElementById('paginationNav');
        const list = document.getElementById('paginationList');
        
        if (totalPages <= 1) {
            nav.style.display = 'none';
            return;
        }

        nav.style.display = 'block';
        list.innerHTML = '';

        // Prev Button
        list.innerHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="prev">Previous</a>
            </li>
        `;

        // Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            list.innerHTML += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        // Next Button
        list.innerHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="next">Next</a>
            </li>
        `;

        // Add event listeners to pagination links
        list.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = e.target.getAttribute('data-page');
                if (targetPage === 'prev' && currentPage > 1) {
                    currentPage--;
                } else if (targetPage === 'next' && currentPage < totalPages) {
                    currentPage++;
                } else if (targetPage !== 'prev' && targetPage !== 'next') {
                    currentPage = parseInt(targetPage);
                }
                renderTable();
            });
        });
    }

    // Filter Logic
    function applyFiltersAndSort() {
        const nameQuery = searchName.value.toLowerCase();
        const rollQuery = searchRoll.value.toLowerCase();
        const sortVal = sortSelect.value;

        // Filter
        filteredStudents = allStudents.filter(student => {
            const name = student.student_name.toLowerCase();
            const roll = student.roll_no.toLowerCase();
            return name.includes(nameQuery) && roll.includes(rollQuery);
        });

        // Sort
        if (sortVal) {
            filteredStudents.sort((a, b) => {
                if (sortVal === 'nameAsc' || sortVal === 'nameDesc') {
                    const nameA = a.student_name.toLowerCase();
                    const nameB = b.student_name.toLowerCase();
                    if (nameA < nameB) return sortVal === 'nameAsc' ? -1 : 1;
                    if (nameA > nameB) return sortVal === 'nameAsc' ? 1 : -1;
                    return 0;
                } else if (sortVal === 'gradeAsc' || sortVal === 'gradeDesc') {
                    const valA = gradeOrder[a.grade] || 0;
                    const valB = gradeOrder[b.grade] || 0;
                    return sortVal === 'gradeAsc' ? valB - valA : valA - valB;
                }
                return 0;
            });
        }

        currentPage = 1;
        renderTable();
    }

    // Event Listeners for Filters
    searchName.addEventListener('input', applyFiltersAndSort);
    searchRoll.addEventListener('input', applyFiltersAndSort);
    sortSelect.addEventListener('change', applyFiltersAndSort);

    // Export to CSV
    exportBtn.addEventListener('click', () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Roll Number,Student Name,Contact Details,Percentage,Grade\r\n";

        filteredStudents.forEach(student => {
            let rowData = [
                student.roll_no.replace(/,/g, ''),
                student.student_name.replace(/,/g, ''),
                student.contact_details.replace(/,/g, ''),
                student.percentage,
                student.grade
            ];
            csvContent += rowData.join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "students_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Initial load
    loadStudents();
});
