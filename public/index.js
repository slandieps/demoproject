//when the button is clicked, the getRandomArtwork function gets executed
document.querySelector('button').addEventListener('click', getRandomArtwork);

//get random artwork on click 
function getRandomArtwork() {
  const button = document.querySelector('button');
  const loadingIndicator = document.querySelector('#loading');
  const img = document.querySelector('img');

  //disables the button to prevent more clicks during loading & shows loading state
  button.disabled = true;
  button.innerText = "l o a d i n g";
  loadingIndicator.style.display = 'block';

//this code block initiates the first call to the Met Museum's Archives and it's asking for artworks have data available
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
//this code block initiates a second call to the Met Museum's Archives and it's asking for artworks that have essential data: image, title, department 
// & if any are missing, the application logs that and calls again for a result that satisfies the call. 
    .then(response => response.json())
    .then(artwork => {
      if (!artwork.primaryImage || !artwork.title || !artwork.department) {
        console.log("Skipping artwork due to missing image or essential data.");
        getRandomArtwork(); // retry with another random pick
        return;
      }

    //this the code block that displays the image
      if (artwork.primaryImage) {
        img.src = artwork.primaryImage;
        img.style.display = 'block';
      } else {
        img.style.display = 'none';
      }

    //next the data gets loaded into the weboage 
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

      //this code block makes the data visible & when the application is resting the data fields are actually invisble
      const listItems = document.querySelectorAll('.data li');
      listItems.forEach((item, index) => {
        item.classList.remove('visible'); // reset on re-click
        setTimeout(() => {
          item.classList.add('visible');
        }, index * 100); // stagger each item for smooth reveal
      });

      //to reset the entire application
      loadingIndicator.style.display = 'none';
      button.disabled = false;
      button.innerText = "seek new vision";
    })

    //catch and logs any errors 
    .catch(error => {
      console.error("error fetching artwork:", error);
      loadingIndicator.innerText = "failed to load artwork. try again.";
      button.disabled = false;
      button.innerText = "try again";
    });
}

