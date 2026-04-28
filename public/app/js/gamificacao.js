// app/js/main.js

document.addEventListener("DOMContentLoaded", async () => {
    // Determine user location or use a default state to load
    const defaultState = "am"; // Could be detected by Geolocation or User Prefs
    
    try {
        await loadStateData(defaultState);
    } catch (e) {
        console.error("Failed to load state data", e);
    }
});

async function loadStateData(uf) {
    const response = await fetch(`/app/data/${uf}.json`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    
    // Update Hero
    document.getElementById("welcome-text").textContent = `Bem-vindo a ${data.state_name}!`;
    
    // In a real app, update background image based on state
    // document.getElementById("hero-section").style.backgroundImage = `url('...')`;

    // Populate "Lugares Imperdíveis" carousel
    const carousel = document.getElementById("places-carousel");
    carousel.innerHTML = ""; // Clear skeletons
    
    const attractions = data.top_attractions.slice(0, 5); // Take top 5
    
    if(attractions.length === 0) {
        carousel.innerHTML = "<p>Nenhum local encontrado.</p>";
        return;
    }

    // Default Images for demo purposes since JSON doesn't contain image URLs
    const fallbackImages = [
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=400",
        "https://images.unsplash.com/photo-1597487124413-82a4c4e8de1e?q=80&w=400",
        "https://images.unsplash.com/photo-1580688877612-61c87a3e24b7?q=80&w=400"
    ];

    attractions.forEach((attr, idx) => {
        const card = document.createElement("div");
        card.className = "place-card";
        
        const imgSrc = fallbackImages[idx % fallbackImages.length];
        
        card.innerHTML = `
            <img src="${imgSrc}" class="place-img" alt="${attr.name}">
            <div class="place-info">
                <h3 class="place-title">${attr.name}</h3>
                <p class="place-subtitle">${attr.category.toUpperCase()}</p>
            </div>
        `;
        
        // Make it clickable to open map or details
        card.addEventListener("click", () => {
            alert(`Abrindo detalhes de: ${attr.name}`);
        });

        carousel.appendChild(card);
    });
}
