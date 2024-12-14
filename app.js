console.log("Welcome to SEO Edge!");
document.querySelector("h1").addEventListener("click", () => {
    alert("Welcome to the interactive SEO Edge!");
});
document.querySelector("#ai-content-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const topic = document.querySelector("#topic").value;

    // Simulated AI response
    const generatedContent = `Here are some tips for ${topic}:
    - Research relevant keywords.
    - Optimize your website structure.
    - Focus on creating high-quality, valuable content.`;

    // Display the generated content below the form
    const output = document.createElement("div");
    output.innerHTML = `<h3>Generated Content:</h3><p>${generatedContent}</p>`;
    document.body.appendChild(output);
});

