let isProcessing = false;

function generateUniqueUUID() {
    // If a click is already being processed, ignore this one
    if (isProcessing) return;

    // Lock the function
    isProcessing = true;

    // Generate the UUID
    const newUUID = crypto.randomUUID();
    console.log("Generated UUID:", newUUID);

    // Display it on your page
    document.getElementById('uuid-display').innerText = newUUID;

    // Unlock after a short delay (e.g., 500ms) to allow the next intentional click
    setTimeout(() => {
        isProcessing = false;
    }, 5000); 
}

// Attach to your button
document.getElementById('uuid-btn').addEventListener('click', generateUniqueUUID);

btn.addEventListener('click', () => {
    const id = crypto.randomUUID();
    display.innerText = id;
    
    btn.disabled = true; // Stop more clicks
    setTimeout(() => btn.disabled = false, 500); // Re-enable later
});
