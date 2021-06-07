let trips = [
    {
        start: "Holborn",
        end: "Earl's Court",
        medium: "Tube"
    },
    {
        start: "Earl's Court",
        end: "Chelsea",
        medium: "Bus"
    },
    {
        start: "Earl's Court",
        end: "Hammersmith",
        medium: "Tube"
    }
];

let userBalance = 30;


// Check whether the trip is anywhere in Zone 1 or not

const anywhereInZone1Check = (trip) => {
    let startPoint = trip.start;
    let endPoint = trip.end;

    if((startPoint === "Holborn") && (endPoint === "Earl's Court")) {
        return true;
    }
    else if((startPoint === "Earl's Court") && (endPoint === "Holborn")) {
        return true;
    }
    
    return false;
}


// Check whether the trip is outside Zone 1 or not

const anyOneZoneOutsideZone1Check = (trip) => {
    let startPoint = trip.start;
    let endPoint = trip.end;

    if((startPoint === "Earl's Court") && (endPoint === "Hammersmith")) {
        return true;
    }
    else if((startPoint === "Hammersmith") && (endPoint === "Earl's Court")) {
        return true;
    }
    
    return false;
}


// Check whether the trip includes Zone 1 or not

const anyTwoZonesIncludingZone1Check = (trip) => {
    let startPoint = trip.start;
    let endPoint = trip.end;

    if((startPoint === "Holborn") || (startPoint === "Earl's Court")) {
        return true;
    }
    else if((endPoint === "Holborn") || (endPoint === "Earl's Court")) {
        return true;
    }
    
    return false;
}


// Check whether the trip excludes Zone 1 or not

const anyTwoZonesExcludingZone1Check = (trip) => {
    let startPoint = trip.start;
    let endPoint = trip.end;
    
    if(!((startPoint === "Holborn") || (endPoint === "Holborn"))) {
        return true;
    }
    
    return false;
}


// Determine the names of the zones from the places names

const determineZoneNames = (places) => {
    let zones = [];
    for(let i=0; i<places.length; i++) {
        let place = places[i];

        switch(place) {
            case "Earl's Court":
                zones.push("Zone 1");
                zones.push("Zone 2");
                break;
            case "Holborn":
                zones.push("Zone 1");
                break;
            case "Wimbledon":
                zones.push("Zone 3");
                break;
            case "Hammersmith":
                zones.push("Zone 2");
                break;
            default:
                zones.push("Zone 0");
                break;
        }
    }

    let uniqueZones = [...new Set(zones)];

    let zonesString = uniqueZones[0];

    if(uniqueZones.length > 1) {
        for(let i=1; i<uniqueZones.length; i++) {
            zonesString = zonesString + " and " + uniqueZones[i];
        }
    }

    return zonesString;
}


// Check whether the places are 3 different zones or not

const threeDifferentZonesCheck = (places) => {
    // If the trip doesn't contain "Earl's Court", the trip will undoubtedly contain 3 different zones.
    // But if the trip containse "Earl's Court", the number of places can be 3 but they may not be 3 different zones. So, we need to check.

    let index = places.findIndex(a => a === "Earl's Court");
    if(index > -1) {
        let HolbornIndex = places.findIndex(a => a === "Holborn");
        let HammersmithIndex = places.findIndex(a => a === "Hammersmith");

        // If the user takes trips to "Holborn", "Earl's Court" and "Hammersmith", he/she may have visited 3 different places but the zones won't be 3 different zones.
        // There will only be zone 1 and zone 2. So, it won't fall under the "Any three zones" condition.

        if((HolbornIndex > -1) && (HammersmithIndex > -1)) {
            return false;
        }

        return true;
    }
    
    return true;
}


// If no trip information is provided, return an error message

if(!(trips || trips.length)) {
    console.log("Please provide valid trips");
    return;
}

let totalFare = 0;

for(let i=0; i<trips.length; i=i+3) {
    // If the number of trips is more than 3, the fare will be calculated for each 3 trips as there is a fixed price option for trips in any 3 zones

    let fareForThreeTrips = 0;
    let places = [];

    for(let j=0; ((j<3) && ((i+j) < trips.length)); j++) {
        //The calculation will be performed on each 3 consecutive trips.

        let trip = trips[i + j];
        let fare = 0;

        if(trip.medium === "Bus") {
            fare = 1.8;
            
            console.log("* As the trip from " + trip.start + " to " + trip.end + " is by bus, the fare is £1.80");
        }
        else {
            places.push(trip.start);
            places.push(trip.end);

            // The fare systems have been arranged in an ascending order.
            // A trip may fall in more than one fare system.
            // To favor the user, the least fare will be calculated here.
            // The smallest fare criteria will be checked first for a trip. If not fulfilled, the next criteria will be checked. Thus we will ensure the least fare for the user.

            if(anyOneZoneOutsideZone1Check(trip)) {
                fare = 2;

                console.log('* As the trip from ' + trip.start + ' to ' + trip.end + ' fulfills the criteria of "Any one zone outside Zone 1", the fare is £2.00');
            }
            else if(anyTwoZonesExcludingZone1Check(trip)) {
                fare = 2.25;

                console.log('* As the trip from ' + trip.start + ' to ' + trip.end + ' fulfills the criteria of "Any two zones excluding Zone 1", the fare is £2.25');
            }
            else if(anywhereInZone1Check(trip)) {
                fare = 2.5;

                console.log('* As the trip from ' + trip.start + ' to ' + trip.end + ' fulfills the criteria of "Anywhere in Zone 1", the fare is £2.50');
            }
            else if(anyTwoZonesIncludingZone1Check(trip)) {
                fare = 3;

                console.log('* As the trip from ' + trip.start + ' to ' + trip.end + ' fulfills the criteria of "Any two zones including Zone 1", the fare is £3.00');
            }
        }

        fareForThreeTrips += fare;
    }

    console.log("* Regular fare for the above trips is £" + fareForThreeTrips.toFixed(2));

    // Filter the places and only take the unique ones (no duplicates)
    let uniquePlaces = [...new Set(places)];

    let zoneNames = determineZoneNames(uniquePlaces);

    if(uniquePlaces.length === 3) {
        if(threeDifferentZonesCheck(uniquePlaces)) {
            if(fareForThreeTrips > 3.20) {
                totalFare += 3.20;

                console.log('* The trip contains 3 different zones: ' + zoneNames + '. So, the "Any three zones" condition will be applied here and the fare will be £3.20');
            }
            else {
                totalFare += fareForThreeTrips;

                console.log('* The trip contains 3 different zones: ' + zoneNames + '. So, the "Any three zones" condition can be applied here. But the regular fare is less than the fare for "Any three zones" criteria. So, to favor the user, the regular fare will be applied.');
            }
        }
        else {
            totalFare += fareForThreeTrips;

            console.log('* Though the trip contains 3 different places, it contains 2 different zones: ' + zoneNames + '. So, the "Any three zones" condition cannot be applied here and the regular fare will prevail.');
        }
    }
    else {
        totalFare += fareForThreeTrips;
    }
}

let userCurrentBalance = userBalance - totalFare;

console.log("* Total fare applied is £" + totalFare.toFixed(2));
console.log("* User's current balance is £" + userCurrentBalance.toFixed(2));