const record = document.querySelector('.record')
const stopElement = document.querySelector('.stop')
const soundClips = document.querySelector('.sound-clips')

if (
  navigator.mediaDevices
  && navigator.mediaDevices.getUserMedia
) {
  console.log('get user media supported!')

  navigator.mediaDevices.getUserMedia({
    audio: true
  }).then(stream => {
    let chunks;

    const mediaRecorder = new MediaRecorder(stream)

    record.addEventListener('click', _ => {
      mediaRecorder.start(1000)
      console.log(mediaRecorder.state)
      console.log('recorder started')
      record.style.background = "red"
      record.style.color = "black"

      chunks = []

      mediaRecorder.ondataavailable = function (e) {
        console.log(e.data)
        chunks.push(e.data)
      }

      stopElement.addEventListener('click', _ => {
        mediaRecorder.stop()
        console.log(mediaRecorder.state)
        console.log('recorder stopped')
        record.style.background = ""
        record.style.color = ""
      })
    })

    mediaRecorder.onstop = function () {
      console.log('recorder stopped')

      const clipName = prompt('Enter a name for your sound clip')

      const clipContainer = document.createElement('article')
      const clipLabel = document.createElement('p')
      const audio = document.createElement('audio')
      const deleteButton = document.createElement('button')
      const downloadButton = document.createElement('button')

      clipContainer.classList.add('clip')
      audio.setAttribute('controls', '')

      deleteButton.innerHTML = 'Delete'

      clipContainer.appendChild(audio)
      clipContainer.appendChild(clipLabel)
      clipContainer.appendChild(deleteButton)
      soundClips.appendChild(clipContainer)

      const blob = new Blob(chunks, {
        type: 'audio/ogg: codecs=opus'
      })

      chunks = []

      const audioURL = window.URL.createObjectURL(blob)
      audio.src = audioURL

      const downloadAnchor = document.createElement('a')

      downloadAnchor.href = audioURL
      downloadAnchor.innerHTML = clipName
      downloadAnchor.setAttribute('download', `${clipName}.mp3`)
      downloadAnchor.setAttribute('target', `_blank`)

      clipContainer.appendChild(downloadAnchor)

      deleteButton.addEventListener('click', deleteEvent => {
        deleteEvent.target.parentNode.parentNode.removeChild(deleteEvent.target.parentNode)
      })

      downloadButton.addEventListener('click', _ => {

      })
    }
  }).catch(err => {
    console.log(`The following getUserMedia error occurred: ${err}`)
  })

}