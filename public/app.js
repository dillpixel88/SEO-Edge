console.log("Welcome to SEO Edge!");

// Event listener for clicking the h1 element
document.querySelector("h1").addEventListener("click", () => {
    alert("Welcome to the interactive SEO Edge!");
});

// Event listener for form submission
document.querySelector("#ai-content-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page refresh

    const topic = document.querySelector("#topic").value; // Get the user input
    if (!topic) {
        alert("Please enter a topic!");
        return;
    }

    // Show a loading message while the content is being generated
    const loadingMessage = document.createElement("p");
    loadingMessage.textContent = "Generating content...";
    loadingMessage.id = "loading-message";
    document.body.appendChild(loadingMessage);

    try {
        // Fetch AI-generated content from the server
        const response = await fetch("http://localhost:3000/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic }), // Send the topic as JSON
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const generatedContent = data; // Update based on the response structure

        // Remove the loading message
        document.getElementById("loading-message").remove();

        // Display the generated content
        const outputDiv = document.createElement("div");
        outputDiv.innerHTML = `
            <h3>Generated Content:</h3>
            <p>${generatedContent}</p>
        `;
        document.body.appendChild(outputDiv);
    } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred while generating content. Please try again.");
    }
});