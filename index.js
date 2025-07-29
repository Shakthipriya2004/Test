const questions = [
  { q: "What is JavaScript?", a: "JavaScript is a programming language used for web development." }, 
  { q: "What is CSS?", a: "CSS is used to style HTML content." },
  { q: "What is HTML?", a: "HTML is the structure of web pages." },
  { q: "What is React?", a: "React is a JavaScript library for building user interfaces." },
  { q: "What is an API?", a: "API stands for Application Programming Interface." },
  { q: "What is a variable?", a: "A container to store values in programming." },
  { q: "What is DOM?", a: "DOM is Document Object Model used to interact with HTML via JS." },
  { q: "What is a function?", a: "A reusable block of code to perform a task." },
  { q: "What is a loop?", a: "A sequence of instructions that is executed repeatedly." },
  { q: "What is a conditional statement?", a: "A statement that controls the flow of a program based on a condition." },
  { q: "What is a closure?", a: "A function that has access to variables in its outer scope, even after it has finished executing." },
  { q: "What is console.log?", a: "A method used to display information in the console of a web page." },
  { q: "What is JSON?", a: "JSON is a text-based format for storing and transporting data." },
  { q: "What is a promise?", a: "A JavaScript object that represents the eventual completion or failure of an asynchronous operation." },
  { q:"What is const in js?", a:"const is a keyword used to declare a constant variable in JavaScript." },
  { q:"What is append?", a:"The append method is used to add new elements to the end of the list." },
  { q:"What is render?", a:"The render method is used to update the UI based on the state of the component." }
];

let viewMode = 'question';
let visibleCount = 5;
let isExpanded = false;
let selectedColumns = ["Questions"]; // Default — show only questions

// ---------------- RENDER QUESTIONS ----------------
function renderQuestions() {
  const container = document.getElementById('questionContainer');
  container.innerHTML = '';

  const searchValue = document.querySelector('.search-bar').value.toLowerCase();
  const filtered = questions.filter(q => 
    q.q.toLowerCase().includes(searchValue) || 
    q.a.toLowerCase().includes(searchValue)
  );

  document.getElementById("loadToggleBtn").textContent = isExpanded ? "Load Less" : "Load More";

  filtered.slice(0, visibleCount).forEach((item, index) => {
    const div = document.createElement('div');
    div.className = `question ${viewMode === 'full' ? 'show-answer' : ''}`;

    div.innerHTML = `
      <label>
        <input type="checkbox" class="qCheck">
        <span class="qText" data-col="Questions">${item.q}</span>
      </label>
      <div class="answer">${item.a}</div>

      <div class="extra-info">
        <span data-col="Owner">Admin</span>
        <span data-col="Type">${index % 2 === 0 ? 'Theory' : 'Numerical'}</span>
        <span data-col="Marks">${Math.floor(Math.random() * 5) + 1}</span>
      </div>

      <div class="icons" data-col="Actions">
        <i class="fas fa-edit" onclick="editQuestion(${index})"></i>
        <i class="fas fa-copy" onclick="copyQA(${index})"></i>
        <i class="fas fa-trash-alt" onclick="deleteQuestion(${index})"></i>
        <i class="fas fa-arrows-alt"></i>
        <i class="fas fa-ellipsis-h"></i>
      </div>
    `;

    if (viewMode === 'question') {
      div.addEventListener('dblclick', () => {
        div.classList.toggle('show-answer');
      });
    }

    container.appendChild(div);
  });

  applyColumnVisibility();
}

// ---------------- SHOW/HIDE COLUMNS ----------------
function applySelections() {
  selectedColumns = ["Questions"]; // Always keep questions
  document.querySelectorAll('#dropdownContent input[type="checkbox"]').forEach(cb => {
    if (cb.checked && cb.value !== "Questions") {
      selectedColumns.push(cb.value);
    }
  });
  toggleDropdown();
  renderQuestions();
}

function applyColumnVisibility() {
  const allCols = ["Questions", "Owner", "Type", "Marks", "Actions"];
  allCols.forEach(col => {
    document.querySelectorAll(`[data-col="${col}"]`).forEach(el => {
      if (col === "Questions") {
        el.style.display = ""; // Always visible
      } else {
        el.style.display = selectedColumns.includes(col) ? "" : "none";
      }
    });
  });
}


// ---------------- OTHER FUNCTIONS ----------------
function editQuestion(index) {
  const q = prompt("Edit Question", questions[index].q);
  const a = prompt("Edit Answer", questions[index].a);
  if (q && a) {
    questions[index] = { q, a };
    renderQuestions();
  }
}

function copyQA(index) {
  const text = `${questions[index].q}\n${questions[index].a}`;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  });
}

function deleteQuestion(index) {
  if (confirm("Delete this question?")) {
    questions.splice(index, 1);
    renderQuestions();
  }
}

function filterQuestions() {
  renderQuestions();
}

function setViewMode(mode) {
  viewMode = mode;
  document.getElementById('fullBtn').classList.toggle('active', mode === 'full');
  document.getElementById('viewBtn').classList.toggle('active', mode === 'question');
  renderQuestions();
}

function selectAllQuestions(checkbox) {
  document.querySelectorAll('.qCheck').forEach(cb => cb.checked = checkbox.checked);
}

function toggleLoad() {
  isExpanded = !isExpanded;
  visibleCount = isExpanded ? questions.length : 5;
  renderQuestions();
}

function addQuestion() {
  const q = prompt("Enter the question:");
  const a = prompt("Enter the answer:");
  if (q && a) {
    questions.push({ q, a });
    renderQuestions();
  }
}

// ---------------- DROPDOWN ----------------
function toggleDropdown() {
  const dropdown = document.getElementById("dropdownContent");
  const isOpen = dropdown.style.display === "block";
  dropdown.style.display = isOpen ? "none" : "block";

  if (!isOpen) {
    document.addEventListener('click', handleOutsideClick);
  } else {
    document.removeEventListener('click', handleOutsideClick);
  }
}

function handleOutsideClick(e) {
  const dropdown = document.getElementById("dropdownContent");
  const button = document.getElementById("viewBtn");
  if (!dropdown.contains(e.target) && !button.contains(e.target)) {
    dropdown.style.display = "none";
    document.removeEventListener('click', handleOutsideClick);
  }
}


// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", () => {
  renderQuestions();
});

setViewMode('question');
