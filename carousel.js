// Array of Project Objects containing all metadata
const projects = [
    {
        src: "images/proj1.png",
        title: "FinTrack App",
        desc: "A mobile expense tracking application that helps users monitor their food, entertainment, and lifestyle spending limits.",
    },
    {
        src: "images/proj2.png",
        title: "Echoes of the Past",
        desc: "An interactive history quiz game featuring voice recognition for answering questions about historical events.",
    },
    {
        src: "images/proj3.png",
        title: "Zodiac Sign Calculator",
        desc: "A mobile tool that determines your astrological sign and provides daily horoscopes based on your birth date.",
    },
    {
        src: "images/proj4.png",
        title: "BMI Calculator",
        desc: "A health utility app that calculates Body Mass Index and provides health category suggestions.",
    },
    {
        src: "images/proj5.jpg",
        title: "ProTech Security",
        desc: "A desktop security system dashboard featuring Monitor, Defense, and Developer modes for network safety.",
    },
    {
        src: "images/proj6.png",
        title: "Kofei Coffee Shop",
        desc: "A branding and web design project for a local coffee shop, focusing on a warm and inviting user interface.",
    },
    {
        src: "images/proj7.png",
        title: "Grade Management System",
        desc: "A comprehensive system for schools to manage student grades, featuring secure login and database integration.",
    },
    {
        src: "images/proj8.png",
        title: "NLMA Product List",
        desc: "A desktop inventory management CRUD application for tracking product codes, names, and quantities.",
    }
];

let current = 0; // Start at the first image

const track = document.querySelector('.carousel-track');
const titleEl = document.getElementById('project-title');
const descEl = document.getElementById('project-desc');

// Create image elements from the projects array
function renderImages() {
    track.innerHTML = '';
    projects.forEach((proj, idx) => {
        const img = document.createElement('img');
        img.src = proj.src;
        img.alt = proj.title; // Accessibility improvement
        img.className = 'carousel-img';
        if (idx === current) img.classList.add('center');
        track.appendChild(img);
    });
}

// Update the Carousel and the Text Info
function updateCarousel() {
    renderImages();
    
    // Update Text Info
    titleEl.textContent = projects[current].title;
    descEl.textContent = projects[current].desc;

    // Center the track
    const offset = (current) * 340; // Adjust logic to center based on your specific CSS width
    // Note: You might need to tweak the calculation depending on how exactly you want it centered
    // For now, let's keep your previous logic style but adjusted for 0-index
    const centerOffset = (340 * current) - (window.innerWidth / 2) + 170; 
    // Simpler previous logic attempt:
    track.style.transform = `translateX(${-((current - 1) * 340)}px)`; 
}

// Auto-scroll logic
let autoScroll = setInterval(nextImage, 3000); // Slower interval for reading text

function resetAutoScroll() {
    clearInterval(autoScroll);
    autoScroll = setInterval(nextImage, 3000);
}

function nextImage() {
    current = (current + 1) % projects.length;
    updateCarousel();
}

function prevImage() {
    current = (current - 1 + projects.length) % projects.length;
    updateCarousel();
}

// Button Listeners
document.getElementById('next-btn').addEventListener('click', () => {
    nextImage();
    resetAutoScroll();
});
document.getElementById('prev-btn').addEventListener('click', () => {
    prevImage();
    resetAutoScroll();
});

// Initial render
updateCarousel();