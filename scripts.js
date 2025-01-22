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

            if (value) { // Only collect non-empty fields
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
            }
        });
    });

    return data;
}


// Add event listener to the Submit button
document.getElementById("submit-button").addEventListener("click", () => {
    const state = document.title.split(": ")[1]; // Get the state from the page title
    const data = collectData();

    for (const [propertyName, propertyData] of Object.entries(data)) {
        const propertyRef = firebase.database().ref(`${state}/${propertyName}`);
        
        // Get the current data from the database to merge with the new data
        propertyRef.once("value").then((snapshot) => {
            const existingData = snapshot.val() || {}; // Fallback to an empty object if no data exists

            // Merge only non-empty fields into existing data
            const updatedData = { ...existingData };
            for (const [key, value] of Object.entries(propertyData)) {
                if (value && typeof value === "object") {
                    // For nested objects, check if they have non-empty values
                    updatedData[key] = {
                        ...existingData[key], // Retain existing nested data
                        ...Object.fromEntries(
                            Object.entries(value).filter(([_, v]) => v?.trim())
                        ),
                    };
                } else if (value.trim()) {
                    // For scalar fields, only update if the value is non-empty
                    updatedData[key] = value;
                }
            }

            // Update the database with the merged data
            propertyRef.update(updatedData)
                .then(() => {
                    console.log(`Data for ${propertyName} in ${state} updated successfully.`);
                })
                .catch((error) => {
                    console.error(`Error updating data for ${propertyName}:`, error);
                });
        }).catch((error) => {
            console.error("Error retrieving existing data:", error);
        });
    }
});




