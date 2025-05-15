document.querySelector('button').addEventListener('click', getRandomArtwork);

function getRandomArtwork() {
  const button = document.querySelector('button');
  const loadingIndicator = document.querySelector('#loading');
  const img = document.querySelector('img');

  // Show loading state
  button.disabled = true;
  button.innerText = "l o a d i n g";
  loadingIndicator.style.display = 'block';

  fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects')
    .then(response => response.json())
    .then(data => {
      if (!data.objectIDs || data.objectIDs.length === 0) {
        throw new Error("No artworks found.");
      }

      const randomIndex = Math.floor(Math.random() * data.objectIDs.length);
      const randomObjectID = data.objectIDs[randomIndex];

      return fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomObjectID}`);
    })
    .then(response => response.json())
    .then(artwork => {
      if (!artwork.primaryImage || !artwork.title || !artwork.department) {
        console.log("Skipping artwork due to missing image or essential data.");
        getRandomArtwork(); // Retry with another random pick
        return;
      }

      if (artwork.primaryImage) {
        img.src = artwork.primaryImage;
        img.style.display = 'block';
      } else {
        img.style.display = 'none';
      }

      document.querySelector('#data-01').innerText = `Department: ${artwork.department || 'Information Missing'}`;
      document.querySelector('#data-02').innerText = `Object Type: ${artwork.objectName || 'Information Missing'}`;
      document.querySelector('#data-03').innerText = `Title: ${artwork.title || 'Information Missing'}`;
      document.querySelector('#data-04').innerText = `Culture: ${artwork.culture || 'Information Missing'}`;
      document.querySelector('#data-05').innerText = `Period: ${artwork.period || 'Information Missing'}`;
      document.querySelector('#data-06').innerText = `Excavation: ${artwork.excavation || 'Information Missing'}`;
      document.querySelector('#data-07').innerText = `Info: ${artwork.classification || 'Information Missing'}`;
      document.querySelector('#data-08').innerText = `Medium: ${artwork.medium || 'Information Missing'}`;
      document.querySelector('#data-09').innerText = `Dimensions: ${artwork.dimensions || 'Information Missing'}`;
      document.querySelector('#data-10').innerText = `Country: ${artwork.country || 'Information Missing'}`;
      document.querySelector('#data-11').innerText = `Rights: ${artwork.rightsAndReproduction || 'Information Missing'}`;

      // Animate each <li> with a fade-in
      const listItems = document.querySelectorAll('.data li');
      listItems.forEach((item, index) => {
        item.classList.remove('visible'); // reset on re-click
        setTimeout(() => {
          item.classList.add('visible');
        }, index * 100); // stagger each item for smooth reveal
      });

      // Reset UI
      loadingIndicator.style.display = 'none';
      button.disabled = false;
      button.innerText = "seek new vision";
    })
    .catch(error => {
      console.error("Error fetching artwork:", error);
      loadingIndicator.innerText = "Failed to load artwork. Please try again.";
      button.disabled = false;
      button.innerText = "try again";
    });
}

