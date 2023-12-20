document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', function (e) {
        var description = prompt('Enter a description:');
        var subdivision = prompt('Enter a subdivision (Equipment, Google Maps Link, Is it Worth It?):');
        if (description !== null && description.trim() !== '' && isValidSubdivision(subdivision)) {
            var linkUrl = prompt('Enter link URL (optional):');
            var imageUrl = prompt('Enter image URL:');
            var pinData = { lat: e.latlng.lat, lng: e.latlng.lng, description, subdivision, imageUrl, linkUrl };

            fetch('/pins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pinData),
            })
            .then(response => response.json())
            .then(savedPin => {
                addPinToMap(savedPin);
            })
            .catch(error => console.error('Error:', error));
        }
    });

    fetch('/pins')
        .then(response => response.json())
        .then(pins => {
            pins.forEach(pin => {
                addPinToMap(pin);
            });
        })
        .catch(error => console.error('Error:', error));

    function isValidSubdivision(subdivision) {
        const validSubdivisions = ['Equipment', 'Google Maps Link', 'Is it Worth It?'];
        return validSubdivisions.includes(subdivision);
    }

    function addPinToMap(pin) {
        var popupContent = pin.description;
        if (pin.subdivision) {
            popupContent += '<br>Subdivision: ' + pin.subdivision;
        }
        popupContent += '<br><img src="' + pin.imageUrl + '" alt="Pin Image">';
        if (pin.linkUrl) {
            popupContent += '<br><a href="' + pin.linkUrl + '" target="_blank">Visit link</a>';
        }

        var marker = L.marker([pin.lat, pin.lng], { draggable: true }).addTo(map);
        marker.bindPopup(popupContent);
    }
});
