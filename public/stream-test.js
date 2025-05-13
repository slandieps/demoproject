const LiveKitClient = window.LivekitClient;
let room;

document.getElementById('join-button').addEventListener('click', joinRoom);

async function joinRoom() {
  const roomName = document.getElementById("room-name").value || "TestRoom";
  const participantName = document.getElementById("participant-name").value || "Participant" + Math.floor(Math.random() * 1000);

  document.getElementById("join-button").disabled = true;
  document.getElementById("join-button").innerText = "Joining...";

  try {
    // Get token from server
    const token = await getToken(roomName, participantName);

    // Connect to LiveKit
    room = new LiveKitClient.Room();

    room.on(LiveKitClient.RoomEvent.TrackSubscribed, (track, publication, participant) => {
      if (track.kind === 'video') {
        const element = track.attach();
        element.autoplay = true;
        element.playsInline = true;

        const container = document.createElement("div");
        container.className = "video-container";
        container.appendChild(element);

        document.getElementById("layout-container").appendChild(container);
      }
    });

    const LIVEKIT_URL = location.hostname === "localhost"
      ? "ws://localhost:7880"
      : `wss://${location.hostname}:7443`;

    await room.connect(LIVEKIT_URL, token);

    // Update UI
    document.getElementById("room-title").innerText = roomName;
    document.getElementById("join").style.display = "none";
    document.getElementById("room").style.display = "block";

    // Enable local tracks
    await room.localParticipant.enableCameraAndMicrophone();

    const localVideoTrack = room.localParticipant.videoTrackPublications.values().next().value.track;
    const localElement = localVideoTrack.attach();
    localElement.autoplay = true;
    localElement.muted = true;
    localElement.playsInline = true;

    const localContainer = document.createElement("div");
    localContainer.className = "video-container";
    localContainer.appendChild(localElement);
    document.getElementById("layout-container").prepend(localContainer);

  } catch (err) {
    console.error("Error joining room:", err);
    alert("Could not join the room.");
  } finally {
    document.getElementById("join-button").disabled = false;
    document.getElementById("join-button").innerText = "Join Room";
  }
}

async function getToken(roomName, participantName) {
  const res = await fetch("/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomName, participantName })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.errorMessage || "Failed to get token");
  return data.token;
}

window.leaveRoom = async function () {
  if (room) {
    await room.disconnect();
    document.getElementById("layout-container").innerHTML = "";
    document.getElementById("join").style.display = "block";
    document.getElementById("room").style.display = "none";
  }
};
