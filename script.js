const THEME_KEY = "skillSphereDarkMode";
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".chip");
const skillGrid = document.getElementById("skillGrid");
const skillCount = document.getElementById("skillCount");
const statSkills = document.getElementById("statSkills");
const favoriteCount = document.getElementById("favoriteCount");
const shareForm = document.getElementById("shareForm");
const faqButtons = document.querySelectorAll(".faq-question");
const contactButton = document.getElementById("contactButton");
const typedText = document.getElementById("typedText");

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeToggle) themeToggle.textContent = "Day Mode";
    }
}

function saveTheme(isDark) {
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
}

const skills = [
    {
        id: 1,
        name: "Sameera",
        skill: "Python",
        category: "Programming",
        level: "Intermediate",
        icon: "🐍",
        favorite: false,
    },
    {
        id: 2,
        name: "Rahul",
        skill: "Photography",
        category: "Photography",
        level: "Beginner",
        icon: "📸",
        favorite: false,
    },
];

let activeCategory = "All";
let searchTerm = "";
let textIndex = 0;
let charIndex = 0;
let typingForward = true;

function animateTypedText() {
    if (!typedText) return;
    const options = [
        "Discover new skills and share your talent.",
        "Find the perfect study partner or mentor.",
        "Build a mini community through SkillSwap Hub."
    ];
    const currentText = options[textIndex];
    typedText.textContent = currentText.slice(0, charIndex);

    if (typingForward) {
        charIndex++;
        if (charIndex > currentText.length) {
            typingForward = false;
            setTimeout(animateTypedText, 1200);
            return;
        }
    } else {
        charIndex--;
        if (charIndex < 0) {
            typingForward = true;
            textIndex = (textIndex + 1) % options.length;
        }
    }
    setTimeout(animateTypedText, typingForward ? 60 : 30);
}

function renderSkills() {
    if (!skillGrid) return;

    const filteredSkills = skills.filter((item) => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const searchLower = searchTerm.toLowerCase().trim();
        const matchesSearch = [item.name, item.skill, item.category, item.level]
            .some((value) => value.toLowerCase().includes(searchLower));
        return matchesCategory && matchesSearch;
    });

    skillGrid.innerHTML = filteredSkills.length
        ? filteredSkills.map(createSkillCardHTML).join("")
        : `<div class="empty-state">No skills match your search or filter.</div>`;

    const favoriteTotal = skills.filter((item) => item.favorite).length;
    if (skillCount) skillCount.textContent = skills.length;
    if (statSkills) statSkills.textContent = skills.length;
    if (favoriteCount) favoriteCount.textContent = favoriteTotal;
}

function createSkillCardHTML(skill) {
    return `
        <div class="skill-card" data-id="${skill.id}">
            <button class="favorite-button" data-action="favorite" data-id="${skill.id}">
                ${skill.favorite ? "❤️" : "🤍"}
            </button>
            <h3>${skill.icon} ${skill.name}</h3>
            <span class="skill-name">${skill.skill}</span>
            <div class="meta">${skill.category}</div>
            <div class="meta">⭐ ${skill.level}</div>
        </div>
    `;
}

function setActiveCategory(category) {
    activeCategory = category;
    categoryButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.category === category);
    });
    renderSkills();
}

function updateSearch(event) {
    searchTerm = event.target.value;
    renderSkills();
}

function toggleFavorite(id) {
    const skill = skills.find((item) => item.id === id);
    if (!skill) return;
    skill.favorite = !skill.favorite;
    renderSkills();
}

function handleGridClick(event) {
    const button = event.target.closest("button[data-action='favorite']");
    if (!button) return;
    const id = Number(button.dataset.id);
    toggleFavorite(id);
}

function handleShareSubmit(event) {
    event.preventDefault();
    if (!shareForm) return;

    const nameInput = document.getElementById("nameInput");
    const skillInput = document.getElementById("skillInput");
    const categoryInput = document.getElementById("categoryInput");
    const levelInput = document.getElementById("levelInput");

    if (!nameInput || !skillInput || !categoryInput || !levelInput) return;

    if (!nameInput.value || !skillInput.value || !categoryInput.value || !levelInput.value) {
        alert("Please complete every field before submitting.");
        return;
    }

    const nextId = skills.length ? Math.max(...skills.map((item) => item.id)) + 1 : 1;
    skills.push({
        id: nextId,
        name: nameInput.value,
        skill: skillInput.value,
        category: categoryInput.value,
        level: levelInput.value,
        icon: getIconForCategory(categoryInput.value),
        favorite: false,
    });

    shareForm.reset();
    setActiveCategory("All");
    if (searchInput) searchInput.value = "";
    alert(`Awesome! ${skillInput.value} has been added to SkillSwap Hub.`);
    renderSkills();
    document.getElementById("skillGrid").scrollIntoView({ behavior: "smooth" });
}

function getIconForCategory(category) {
    switch (category) {
        case "Programming":
            return "💻";
        case "Design":
            return "🎨";
        case "Photography":
            return "📸";
        case "Music":
            return "🎵";
        case "Cooking":
            return "🍳";
        case "Languages":
            return "🗣";
        default:
            return "⭐";
    }
}

function toggleTheme() {
    if (!themeToggle) return;
    const isDark = !document.body.classList.contains("dark-mode");
    document.body.classList.toggle("dark-mode", isDark);
    themeToggle.textContent = isDark ? "Day Mode" : "Night Mode";
    saveTheme(isDark);
}

function toggleFAQ(event) {
    const card = event.target.closest(".faq-card");
    if (!card) return;
    card.classList.toggle("open");
}

function contactAction() {
    alert("Thanks! We will be in touch soon. Explore more connections on SkillSphere.");
}

if (typedText) animateTypedText();
if (searchInput) searchInput.addEventListener("input", updateSearch);
if (categoryButtons.length) {
    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => setActiveCategory(button.dataset.category));
    });
}
if (skillGrid) skillGrid.addEventListener("click", handleGridClick);
if (shareForm) shareForm.addEventListener("submit", handleShareSubmit);
if (faqButtons.length) {
    faqButtons.forEach((button) => button.addEventListener("click", toggleFAQ));
}
if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
}
if (contactButton) contactButton.addEventListener("click", contactAction);

loadTheme();
renderSkills();