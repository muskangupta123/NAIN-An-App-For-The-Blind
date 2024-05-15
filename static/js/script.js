document.addEventListener('DOMContentLoaded', function () {
    const objectDetectionButton = document.getElementById('objectDetectionButton');
    const cameraModal = document.getElementById('cameraModal');
    const cameraVideo = document.getElementById('cameraVideo');
    const closeCameraModalButton = document.getElementById('closeCameraModal');

    function startCameraFeed() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                cameraVideo.srcObject = stream;
                cameraModal.style.display = 'flex';
            })
            .catch(function (error) {
                console.error('Error accessing the camera:', error);
            });
    }

    objectDetectionButton.addEventListener('click', function (event) {
        event.preventDefault();
        const allowCamera = confirm('Allow access to your camera for object detection?');
        if (allowCamera) {
            startCameraFeed();
        }
    });

    closeCameraModalButton.addEventListener('click', function () {
        cameraVideo.srcObject.getTracks().forEach(track => track.stop());
        cameraModal.style.display = 'none';
    });

    // Send the frame to the Flask backend for object detection
    cameraVideo.addEventListener('play', function () {
        setInterval(function () {
            const canvas = document.createElement('canvas');
            canvas.width = cameraVideo.videoWidth;
            canvas.height = cameraVideo.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
            const frame = canvas.toDataURL('image/jpeg');

            fetch('/detect_objects', {
                method: 'POST',
                body: JSON.stringify({ frame: frame }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.blob())
            .then(blob => {
                const objectUrl = URL.createObjectURL(blob);
                // Display the detected objects
                // You can update the UI to show the detected objects in the 'cameraModalContent' div
            })
            .catch(error => console.error('Error detecting objects:', error));
        }, 1000); // Adjust the interval as needed
    });
});
