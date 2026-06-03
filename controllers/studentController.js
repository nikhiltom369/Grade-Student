const { db } = require('../config/firebase');
const gradeService = require('../services/gradeService');

const handleAddStudent = async (req, res) => {
    const { student_name, roll_no, contact_details, sub1, sub2, sub3, sub4, sub5, sub6 } = req.body;

    // Validation (Server Side)
    let errorMessage = null;

    if (!student_name || student_name.length < 2 || !/^[A-Za-z\s]+$/.test(student_name)) {
        errorMessage = "Invalid Student Name. Must be at least 2 characters and contain only alphabets and spaces.";
    } else if (!roll_no) {
        errorMessage = "Roll Number is required.";
    } else if (!contact_details) {
        errorMessage = "Contact Details are required.";
    }

    const marks = [sub1, sub2, sub3, sub4, sub5, sub6].map(m => parseFloat(m));
    if (!errorMessage) {
        for (let i = 0; i < marks.length; i++) {
            if (isNaN(marks[i]) || marks[i] < 0 || marks[i] > 100) {
                errorMessage = `Invalid marks for Subject ${i+1}. Must be a number between 0 and 100.`;
                break;
            }
        }
    }

    if (errorMessage) {
        return res.status(400).json({ success: false, error: errorMessage });
    }

    try {
        if (!db) {
            return res.status(500).json({ success: false, error: "Database not configured! Please set up Firebase." });
        }
        
        // Roll Number Uniqueness check
        const studentsRef = db.collection('students');
        const snapshot = await studentsRef.where('roll_no', '==', roll_no).get();
        if (!snapshot.empty) {
            return res.status(400).json({ success: false, error: "Roll Number already exists." });
        }

        // Calculations
        const best5_total = gradeService.calculateBest5Total(marks);
        const percentage = parseFloat(gradeService.calculatePercentage(best5_total).toFixed(2));
        const grade = gradeService.calculateGrade(percentage);

        // Save to DB
        const newStudent = {
            student_name,
            roll_no,
            contact_details,
            subject1: marks[0],
            subject2: marks[1],
            subject3: marks[2],
            subject4: marks[3],
            subject5: marks[4],
            subject6: marks[5],
            best5_total,
            percentage,
            grade,
            created_at: new Date()
        };

        const docRef = await studentsRef.add(newStudent);

        // Success
        return res.json({ 
            success: true, 
            message: `Student details saved successfully. Grade: ${grade}`,
            data: { id: docRef.id, ...newStudent }
        });

    } catch (error) {
        console.error("Error saving student:", error);
        return res.status(500).json({ success: false, error: "Error saving student: " + error.message });
    }
};

const getStudents = async (req, res) => {
    try {
        if (!db) {
             return res.status(500).json({ success: false, error: "Database not configured." });
        }
        
        const studentsRef = db.collection('students');
        const snapshot = await studentsRef.orderBy('created_at', 'desc').get();
        
        const students = [];
        snapshot.forEach(doc => {
            students.push({ id: doc.id, ...doc.data() });
        });

        res.json({ success: true, students });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ success: false, error: "Error fetching student records." });
    }
};

module.exports = {
    handleAddStudent,
    getStudents
};
