export const generateConversationId = (user1, user2) => {
  const id1 = user1?.email ? encodeEmail(user1.email) : user1.uid;
  const id2 = user2?.email ? encodeEmail(user2.email) : user2.uid;
  return [id1, id2].sort().join("_");
};

const encodeEmail = (email) => {
  return email.replace(".", ",");
};
// This function is for voice recording
export const startRecording = async (
  setMediaRecorder,
  setFile,
  setFilePreview
) => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    const audioFile = new File([event.data], "audio.mp3", {
      type: "audio/mp3",
    });
    const audioUrl = URL.createObjectURL(audioFile);
    setFile(audioFile);
    const previewUrl = URL.createObjectURL(audioFile);
    setFilePreview(previewUrl);
  };
  recorder.start();
  setMediaRecorder(recorder);
};

export const stopRecording = (mediaRecorder) => {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
};

export const startVideoRecording = async (
  setMediaRecorder,
  setFile,
  setFilePreview
) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  const mediaRecorder = new MediaRecorder(stream);
  const chunks = [];

  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const videoURL = URL.createObjectURL(blob);
    setFile(blob);
    setFilePreview(videoURL);
  };

  mediaRecorder.start();
  setMediaRecorder(mediaRecorder);
  return stream;
};

export const captureImage = async (setFile, setFilePreview) => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.createElement("video");
  video.srcObject = stream;
  await video.play();

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const file = await new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });

  const previewUrl = URL.createObjectURL(file);
  setFile(file);
  setFilePreview(previewUrl);

  stream.getTracks().forEach((track) => track.stop());
};
