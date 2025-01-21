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

function loadFromFirebase(state) {
    const db = getDatabase();
    const stateRef = ref(db, `properties/${state}`);
    onValue(stateRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            populateForm(data);
        }
    });
}

function populateForm(data) {
    for (const [propertyName, propertyDetails] of Object.entries(data)) {
        for (const [fieldKey, fieldDetails] of Object.entries(propertyDetails)) {
            const nameId = `${propertyName.toLowerCase().replace(/\s+/g, "-")}-${fieldKey}-name`;
            const emailId = `${propertyName.toLowerCase().replace(/\s+/g, "-")}-${fieldKey}-email`;
            const unitId = `${propertyName.toLowerCase().replace(/\s+/g, "-")}-unit`;

            if (fieldDetails.name) {
                document.getElementById(nameId)?.setAttribute("value", fieldDetails.name);
            }
            if (fieldDetails.email) {
                document.getElementById(emailId)?.setAttribute("value", fieldDetails.email);
            }
            if (fieldKey === "unitCount") {
                document.getElementById(unitId)?.setAttribute("value", propertyDetails.unitCount);
            }
        }
    }
}


// Add event listener to the Submit button
document.getElementById("submit-button").addEventListener("click", () => {
    const state = document.title.split(": ")[1];
    const data = collectData();
    saveDataToFirebase(state, data);
});

window.addEventListener("load", () => {
    const state = document.title.split(": ")[1];
    loadFromFirebase(state);
});


window.addEventListener("load", () => {
    const state = document.title.split(": ")[1]; // Get the state from the page title
    getPropertyDataByState(state, (data) => {
        if (data) {
            for (const [propertyName, propertyDetails] of Object.entries(data)) {
                for (const [fieldKey, fieldDetails] of Object.entries(propertyDetails)) {
                    const nameId = `${propertyName.toLowerCase().replace(/\s+/g, "-")}-${fieldKey}-name`;
                    const emailId = `${propertyName.toLowerCase().replace(/\s+/g, "-")}-${fieldKey}-email`;
                    const unitId = `${propertyName.toLowerCase().replace(/\s+/g, "-")}-unit`;

                    if (fieldDetails.name) {
                        document.getElementById(nameId).value = fieldDetails.name || "";
                    }
                    if (fieldDetails.email) {
                        document.getElementById(emailId).value = fieldDetails.email || "";
                    }
                    if (fieldKey === "unitCount") {
                        document.getElementById(unitId).value = propertyDetails.unitCount || "";
                    }
                }
            }
        }
    });
});
