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
        // Fetch AI-generated content from the backend
        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const generatedContent = data.trim(); // Extract the AI response

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
    } finally {
        // Remove loading message
        document.body.removeChild(loadingMessage);
    }
});

// Event listener for citation form submission
document.querySelector("#citation-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const author = document.querySelector("#author").value;
    const title = document.querySelector("#title").value;
    const website = document.querySelector("#website").value;
    const date = document.querySelector("#date").value;
    const url = document.querySelector("#url").value;
    const style = document.querySelector("#style").value;

    if (!author || !title || !website || !date || !url || !style) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        // Make a POST request to the backend
        const response = await fetch("/generate-citation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ author, title, website, date, url, style }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        document.querySelector("#citation-output").innerHTML = `
            <h3>Generated Citation:</h3>
            <p>${data.citation}</p>
        `;
    } catch (error) {
        console.error(error);
        alert("Failed to generate citation. Please try again.");
    }
});