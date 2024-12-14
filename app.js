console.log("Welcome to SEO Edge!");
document.querySelector("h1").addEventListener("click", () => {
    alert("Welcome to the interactive SEO Edge!");
});
document.querySelector("#ai-content-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const topic = document.querySelector("#topic").value;
    console.log(`Generating content for: ${topic}`);
    // Placeholder logic for AI generation
    alert(`Content generated for: ${topic}`);
});
