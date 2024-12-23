document.querySelector("#ai-content-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const topic = document.querySelector("#topic").value.trim();
    const resultsDiv = document.querySelector("#results");

    // Clear previous results
    resultsDiv.innerHTML = "";
    if (!topic) {
        resultsDiv.innerHTML = "<p>Please enter a valid topic!</p>";
        return;
    }

    // Show loading message
    resultsDiv.innerHTML = "<p>Generating content...</p>";

    try {
        // Send POST request to the backend
        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Display the generated content
        resultsDiv.innerHTML = `
            <h3>Generated Content:</h3>
            <p>${data.text}</p>
        `;
    } catch (error) {
        console.error("An error occurred:", error);
        resultsDiv.innerHTML = "<p style='color: red;'>An error occurred while generating content. Please try again.</p>";
    } finally {
        document.querySelector("#topic").value = "";
    }
});