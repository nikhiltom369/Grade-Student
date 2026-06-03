// Client-side Validation (Bootstrap 5)
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
})();

// Student List Bonus Features: Search, Sort, Pagination, Export CSV
document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('studentTable');
    if (!table) return;

    const searchName = document.getElementById('searchName');
    const searchRoll = document.getElementById('searchRoll');
    const sortSelect = document.getElementById('sortSelect');
    const exportBtn = document.getElementById('exportBtn');
    const tbody = table.querySelector('tbody');
    let rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Check if table is empty
    if (rows.length === 1 && rows[0].cells.length === 1) {
        // No records
        return;
    }

    // Pagination configuration
    const rowsPerPage = 10;
    let currentPage = 1;
    let filteredRows = [...rows];

    const gradeOrder = { 'A+': 7, 'A': 6, 'B+': 5, 'B': 4, 'C+': 3, 'C': 2, 'D': 1 };

    // Update Table view based on filtered rows and pagination
    function renderTable() {
        // Clear table
        tbody.innerHTML = '';
        
        // Calculate pagination
        const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageRows = filteredRows.slice(start, end);

        if (pageRows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No records match your search.</td></tr>';
        } else {
            pageRows.forEach(row => tbody.appendChild(row));
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
        filteredRows = rows.filter(row => {
            const roll = row.cells[0].innerText.toLowerCase();
            const name = row.cells[1].innerText.toLowerCase();
            return name.includes(nameQuery) && roll.includes(rollQuery);
        });

        // Sort
        if (sortVal) {
            filteredRows.sort((a, b) => {
                if (sortVal === 'nameAsc' || sortVal === 'nameDesc') {
                    const nameA = a.cells[1].innerText.toLowerCase();
                    const nameB = b.cells[1].innerText.toLowerCase();
                    if (nameA < nameB) return sortVal === 'nameAsc' ? -1 : 1;
                    if (nameA > nameB) return sortVal === 'nameAsc' ? 1 : -1;
                    return 0;
                } else if (sortVal === 'gradeAsc' || sortVal === 'gradeDesc') {
                    const gradeA = a.cells[4].getAttribute('data-grade');
                    const gradeB = b.cells[4].getAttribute('data-grade');
                    const valA = gradeOrder[gradeA] || 0;
                    const valB = gradeOrder[gradeB] || 0;
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

        // Export all rows (not just the current page or filtered, or maybe filtered)
        // Let's export filtered rows
        filteredRows.forEach(row => {
            let rowData = [];
            for (let i = 0; i < 5; i++) {
                // Remove commas from text to avoid breaking CSV
                let cellText = row.cells[i].innerText.replace(/,/g, '');
                rowData.push(cellText);
            }
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

    // Initial render
    renderTable();
});
