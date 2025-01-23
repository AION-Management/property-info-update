import { writePropertyData } from "./firebaseService.js";

// Function to collect all text areas and organize data
function collectData() {
    const data = {};
    const properties = document.querySelectorAll(".grid-item");

    properties.forEach((property) => {
        const propertyName = property.querySelector("h2 span").textContent.trim();
        const fields = property.querySelectorAll("textarea");

        data[propertyName] = {};

        fields.forEach((field) => {
            const id = field.id;
            const value = field.value.trim();

            if (id.includes("name")) {
                const key = id.split("-name")[0];
                data[propertyName][key] = data[propertyName][key] || {};
                data[propertyName][key].name = value;
            } else if (id.includes("email")) {
                const key = id.split("-email")[0];
                data[propertyName][key] = data[propertyName][key] || {};
                data[propertyName][key].email = value;
            } else if (id.includes("unit")) {
                data[propertyName]["unitCount"] = value;
            }
        });
    });

    return data;
}

// Add event listener to the Submit button
document.getElementById("submit-button").addEventListener("click", () => {
    const state = document.title.split(": ")[1]; // Get the state from the page title
    const data = collectData();

    // Save data using firebaseService.js
    for (const [propertyName, propertyData] of Object.entries(data)) {
        writePropertyData(state, propertyName, propertyData)
            .then(() => {
                console.log(`Data for ${propertyName} in ${state} saved successfully.`);
            })
            .catch((error) => {
                console.error(`Error saving data for ${propertyName}:`, error);
            });
    }
});


