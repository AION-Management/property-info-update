function writeUserData(state, property, rvp, reg, am, pm, unit) {
    const dbRef = firebase.database().ref(state + '/' + property);
    return dbRef.set({
        state: state,
        property: property,
        rvp: rvp,
        regional: reg,
        assetManager: am,
        propertyManager: pm,
        unitCount: unit 
    });
}

function getStatusUpdates(app, callback) {
    const dbRef = firebase.database().ref('users/' + app);
    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}
export { writeUserData, getStatusUpdates };