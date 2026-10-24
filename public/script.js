const courseForm = document.getElementById("courseForm");

const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");

const titleError = document.getElementById("titleError");
const categoryError = document.getElementById("categoryError");
const descriptionError = document.getElementById("descriptionError");

const courseList = document.getElementById("courseList");
const courseCount = document.getElementById("courseCount");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const emptyMessage = document.getElementById("emptyMessage");

const formMessage = document.getElementById("formMessage");

const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const searchInput = document.getElementById("searchInput");

let courses = [];
let editingId = null;


// ========================================
// LOAD COURSES
// ========================================

async function loadCourses() {
    loading.hidden = false;
    errorMessage.hidden = true;
    emptyMessage.hidden = true;

    try {
        const response = await fetch("/api/courses");

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to load courses.");
        }

        courses = data.courses;

        displayCourses(courses);

    } catch (error) {
        console.error(error);

        loading.hidden = true;
        errorMessage.hidden = false;
        errorMessage.textContent =
            "Unable to load courses. Please check the server.";
    }
}


// ========================================
// DISPLAY COURSES
// ========================================

function displayCourses(courseArray) {

    loading.hidden = true;

    courseList.innerHTML = "";

    courseCount.textContent = courseArray.length;

    if (courseArray.length === 0) {
        emptyMessage.hidden = false;
        return;
    }

    emptyMessage.hidden = true;

    courseArray.forEach(course => {

        const card = document.createElement("article");

        card.className = "course-card";

        card.innerHTML = `
            <span class="course-category">
                ${escapeHTML(course.category)}
            </span>

            <h3>
                ${escapeHTML(course.title)}
            </h3>

            <p>
                ${escapeHTML(course.description)}
            </p>

            <div class="course-actions">

                <button
                    class="edit-btn"
                    onclick="editCourse(${course.id})"
                >
                    ✏️ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteCourse(${course.id})"
                >
                    🗑️ Delete
                </button>

            </div>
        `;

        courseList.appendChild(card);
    });
}


// ========================================
// ADD / UPDATE COURSE
// ========================================

courseForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearErrors();
    clearFormMessage();

    const title = titleInput.value.trim();
    const category = categoryInput.value.trim();
    const description = descriptionInput.value.trim();

    let valid = true;


    // Title validation
    if (title.length < 3) {

        titleError.textContent =
            "Title must contain at least 3 characters.";

        valid = false;
    }


    // Category validation
    if (!category) {

        categoryError.textContent =
            "Please select a category.";

        valid = false;
    }


    // Description validation
    if (description.length < 10) {

        descriptionError.textContent =
            "Description must contain at least 10 characters.";

        valid = false;
    }


    if (!valid) {
        return;
    }


    const courseData = {
        title,
        category,
        description
    };


    try {

        submitBtn.disabled = true;

        submitBtn.textContent =
            editingId ? "Updating..." : "Adding...";


        let response;


        // UPDATE
        if (editingId) {

            response = await fetch(
                `/api/courses/${editingId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(courseData)
                }
            );

        }

        // CREATE
        else {

            response = await fetch(
                "/api/courses",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(courseData)
                }
            );
        }


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Something went wrong."
            );
        }


        // Success message
        showFormMessage(
            data.message,
            "success"
        );


        resetForm();

        await loadCourses();


    } catch (error) {

        console.error(error);

        showFormMessage(
            error.message,
            "error"
        );

    } finally {

        submitBtn.disabled = false;

        submitBtn.textContent =
            editingId ? "Update Course" : "Add Course";
    }
});


// ========================================
// EDIT COURSE
// ========================================

window.editCourse = function (id) {

    const course = courses.find(
        item => item.id === id
    );

    if (!course) {
        return;
    }


    editingId = id;


    titleInput.value =
        course.title;

    categoryInput.value =
        course.category;

    descriptionInput.value =
        course.description;


    submitBtn.textContent =
        "Update Course";

    cancelEditBtn.hidden = false;


    document
        .getElementById("add-course")
        .scrollIntoView({
            behavior: "smooth"
        });
};


// ========================================
// CANCEL EDIT
// ========================================

cancelEditBtn.addEventListener(
    "click",
    function () {

        resetForm();

    }
);


// ========================================
// DELETE COURSE
// ========================================

window.deleteCourse = async function (id) {

    const course = courses.find(
        item => item.id === id
    );

    if (!course) {
        return;
    }


    const confirmed = confirm(
        `Are you sure you want to delete "${course.title}"?`
    );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `/api/courses/${id}`,
            {
                method: "DELETE"
            }
        );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to delete course."
            );
        }


        alert(
            "Course deleted successfully."
        );


        await loadCourses();


    } catch (error) {

        console.error(error);

        alert(
            error.message
        );
    }
};


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
    "input",
    function () {

        const searchTerm =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredCourses =
            courses.filter(course => {

                return (
                    course.title
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    course.category
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    course.description
                        .toLowerCase()
                        .includes(searchTerm)
                );

            });


        displayCourses(
            filteredCourses
        );
    }
);


// ========================================
// RESET FORM
// ========================================

function resetForm() {

    courseForm.reset();

    editingId = null;

    clearErrors();

    clearFormMessage();

    submitBtn.textContent =
        "Add Course";

    cancelEditBtn.hidden = true;
}


// ========================================
// VALIDATION HELPERS
// ========================================

function clearErrors() {

    titleError.textContent = "";

    categoryError.textContent = "";

    descriptionError.textContent = "";
}


function showFormMessage(
    message,
    type
) {

    formMessage.textContent =
        message;

    formMessage.style.color =
        type === "success"
            ? "#4ade80"
            : "#f87171";
}


function clearFormMessage() {

    formMessage.textContent = "";

}


// ========================================
// SECURITY HELPER
// ========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// INITIAL LOAD
// ========================================

loadCourses();