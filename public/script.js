if (typeof document !== 'undefined') {
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
            // Ensure the API key is loaded
            if (!process.env.OPENAI_API_KEY) {
                throw new Error("API key is missing. Please check your environment variables.");
            }

            // Fetch AI-generated content from OpenAI API
            const response = await fetch("https://api.openai.com/v1/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // API key securely loaded from .env
                },
                body: JSON.stringify({
                    model: "text-davinci-003", // AI model
                    prompt: `Write a blog post about: ${topic}`, // The input topic
                    max_tokens: 150, // Limit the response length
                    temperature: 0.7 // Control creativity level
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const generatedContent = data.choices[0].text.trim(); // Extract the AI response

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
            // Remove the loading message
            document.getElementById("loading-message").remove();
        }
    });
}
