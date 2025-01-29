import { writePropertyData, getPropertyDataByState } from "./firebaseService.js";

function populateExistingData() {
    const state = document.title.split(": ")[1];
    
    getPropertyDataByState(state, (data) => {
        if (data) {
            // Iterate through each property in the data
            Object.entries(data).forEach(([propertyName, propertyData]) => {
                // Find the corresponding grid item
                const propertyElement = Array.from(document.querySelectorAll('.grid-item'))
                    .find(element => element.querySelector('h2 span').textContent.trim() === propertyName);
                
                if (propertyElement) {
                    // Populate each field
                    Object.entries(propertyData).forEach(([role, info]) => {
                        // Convert the ID to match the format in your HTML
                        const formattedPropertyName = propertyName.toLowerCase().replace(/\s+/g, '-');
                        
                        if (role !== 'unit') {
                            // Handle name field
                            const nameField = propertyElement.querySelector(`#${formattedPropertyName}-${role}-name`);
                            if (nameField && info.name) {
                                nameField.value = info.name;
                            }
                            
                            // Handle email field
                            const emailField = propertyElement.querySelector(`#${formattedPropertyName}-${role}-email`);
                            if (emailField && info.email) {
                                emailField.value = info.email;
                            }
                        } else {
                            // Handle unit count field
                            const unitField = propertyElement.querySelector(`#${formattedPropertyName}-unit`);
                            if (unitField) {
                                unitField.value = info;
                            }
                        }
                    });
                }
            });
        }
    });
}

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
                const key = id.split("-name")[0].split('-').slice(-1)[0];  // Get the role part (vp, rem, etc.)
                data[propertyName][key] = data[propertyName][key] || {};
                data[propertyName][key].name = value;
            } else if (id.includes("email")) {
                const key = id.split("-email")[0].split('-').slice(-1)[0];  // Get the role part (vp, rem, etc.)
                data[propertyName][key] = data[propertyName][key] || {};
                data[propertyName][key].email = value;
            } else if (id.includes("unit")) {
                data[propertyName].unit = value;
            }
        });
    });

    return data;
}

// Add event listener for page load
document.addEventListener('DOMContentLoaded', () => {
    populateExistingData();
});

document.getElementById("submit-button").addEventListener("click", () => {
    const state = document.title.split(": ")[1];
    const data = collectData();

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
