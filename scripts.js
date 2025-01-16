import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// Firebase initialization (update with your config)
const db = getDatabase();

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

// Function to save data to Firebase
function saveDataToFirebase(state, data) {
    const stateRef = ref(db, `properties/${state}`);
    set(stateRef, data)
        .then(() => {
            alert("Data submitted successfully!");
        })
        .catch((error) => {
            console.error("Error saving data:", error);
            alert("Error submitting data. Check the console for details.");
        });
}

// Add event listener to the Submit button
document.getElementById("submit-button").addEventListener("click", () => {
    const state = document.title.split(": ")[1]; // Get the state from the page title
    const data = collectData();

    saveDataToFirebase(state, data);
});
