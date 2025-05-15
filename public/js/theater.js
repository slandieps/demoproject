document.addEventListener("DOMContentLoaded", () => {
  // Fade-in animation
  document.querySelectorAll(".fade-in").forEach(el => {
    el.classList.add("visible");
  });

  // Inspirational quote rotation
  const quotes = [
    "“The present moment is the only time we have dominion over.” – Thích Nhất Hạnh",
    "“Art enables us to find ourselves and lose ourselves at the same time.” – Thomas Merton",
    "“To create one's world in any of the arts takes courage.” – Georgia O’Keeffe",
    "“Art washes away from the soul the dust of everyday life.” – Pablo Picasso",
    "“Stillness is where creativity and solutions are found.” – Eckhart Tolle",
    "“You must have chaos within you to give birth to a dancing star.” – Nietzsche",
    "“A line is a dot that went for a walk.” – Paul Klee",
    "“In the midst of movement and chaos, keep stillness inside of you.” – Deepak Chopra",
    "“Art is the only way to run away without leaving home.” – Twyla Tharp",
    "“Painting is just another way of keeping a diary.” – Pablo Picasso",
    "“Every act of creation is first an act of destruction.” – Pablo Picasso",
    "“The most beautiful thing we can experience is the mysterious.” – Albert Einstein",
    "“There is peace even in the storm.” – Vincent van Gogh",
    "“Your inner peace is the greatest and most valuable treasure you can discover.” – Akin Olokun",
    "“Simplicity is the ultimate sophistication.” – Leonardo da Vinci",
    "“All art is but imitation of nature.” – Seneca",
    "“If you hear a voice within you say ‘you cannot paint,’ then by all means paint.” – Vincent van Gogh",
    "“Creativity takes courage.” – Henri Matisse",
    "“A true artist is not one who is inspired, but one who inspires others.” – Salvador Dalí",
    "“I dream my painting, then I paint my dream.” – Vincent van Gogh",
    "“Art should comfort the disturbed and disturb the comfortable.” – Banksy",
    "“The only journey is the one within.” – Rainer Maria Rilke",
    "“With freedom, books, flowers, and the moon, who could not be happy?” – Oscar Wilde",
    "“You don’t make a photograph just with a camera. You bring to the act of photography all the pictures you have seen.” – Ansel Adams",
    "“An artist is not paid for his labor but for his vision.” – James Whistler",
    "“Every canvas is a journey all its own.” – Helen Frankenthaler",
    "“A work of art is a scream of freedom.” – Christo",
    "“Art is restoration: the idea is to repair the damages that are inflicted in life.” – Louise Bourgeois",
    "“Color is a power which directly influences the soul.” – Wassily Kandinsky",
    "“The essence of all beautiful art, all great art, is gratitude.” – Friedrich Nietzsche"
  ];
  const random = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteBox").innerText = quotes[random];

  // Static playlist embed (not randomized)
  const playlistId = "PLDNd4Z2CqFz075-utTDZdl_WdVilGVD7n";
  const player = document.getElementById("theaterPlayer");
  if (player) {
    player.src = `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0&autoplay=1&mute=1`;
  }
});
