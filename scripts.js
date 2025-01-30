import { writePropertyData, getPropertyDataByState } from "./firebaseService.js";

function escapeCSSSelector(str) {
    // If the string starts with a digit, escape it
    if (/^\d/.test(str)) {
        return '\\3' + str[0] + ' ' + str.slice(1);
    }
    return str;
}

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
                        if (role.includes('-unit')) {
                            const unitField = propertyElement.querySelector(`#${escapeCSSSelector(role)}`);
                            if (unitField) {
                                unitField.value = info;
                            }
                        } else {
                            // Handle name field
                            const nameField = propertyElement.querySelector(`#${escapeCSSSelector(role)}-name`);
                            if (nameField && info.name) {
                                nameField.value = info.name;
                            }
                            
                            // Handle email field
                            const emailField = propertyElement.querySelector(`#${escapeCSSSelector(role)}-email`);
                            if (emailField && info.email) {
                                emailField.value = info.email;
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

            // Get the base ID without -name or -email
            const baseId = id.replace(/-name$/, '').replace(/-email$/, '');

            if (id.includes('unit')) {
                data[propertyName][baseId] = value;
            } else if (id.includes('name')) {
                data[propertyName][baseId] = data[propertyName][baseId] || {};
                data[propertyName][baseId].name = value;
            } else if (id.includes('email')) {
                data[propertyName][baseId] = data[propertyName][baseId] || {};
                data[propertyName][baseId].email = value;
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
