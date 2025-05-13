//pull files from met museum collection by keyword search

document.querySelector('button').addEventListener('click', getRandomArtwork)

function getRandomArtwork() {
    fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects')
    .then(response => response.json())
    .then(data => {
        //pick random artwork from array
        const randomIndex = Math.floor(Math.random() * data.objectIDs.length);
        const randomObjectID = data.objectIDs[randomIndex];

         //fetch details for object
         return fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomObjectID}`);
    })
    .then(response => response.json())
    .then(data => {

        //pull and display relevant artwork details
        const artwork = data;
        document.querySelector('img').src = artwork.primaryImage || '';
        document.querySelector('#data-01').innerText = artwork.department || 'Missing Data';
        document.querySelector('#data-02').innerText = artwork.objectName || 'Missing Data';
        document.querySelector('#data-03').innerText = artwork.title || 'Missing Data';
        document.querySelector('#data-04').innerText = artwork.culture || 'Missing Data';
        document.querySelector('#data-05').innerText = artwork.period || 'Missing Data';
        document.querySelector('#data-06').innerText = artwork.excavation || 'Missing Data';
        document.querySelector('#data-08').innerText = artwork.medium || 'Missing Data';
        document.querySelector('#data-09').innerText = artwork.dimensions || 'Missing Data';
        document.querySelector('#data-10').innerText = artwork.country || 'Missing Data';
        document.querySelector('#data-11').innerText = artwork.rightsAndReproduction || 'Missing Data';
})
    .catch(error => console.log(error))
}