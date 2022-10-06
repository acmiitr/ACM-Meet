// const io = require('socket.io')(server);

// const socket = io('/');
let myvidS
const vidgrid = document.getElementById('vidgrid')
const myvid = document.createElement('video') //adding an html element for video
myvid.muted = true; //initally the video is m
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false
}).then(stream => {
  myvidS = stream;
  addVidS(myvid, stream);

  peer.on('call', function (call) {
    // Answer the call, providing our mediaStream
    call.answer(stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVidS(video, userVideoStream)
    })
  });
  socket.on('user-connected', (userid) => {
    connectNewuser(userid, stream);
  })



  
})
//prompting the user for permissions!(a promise of Js)

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '30000'
});
socket.on('user-disconnected', userid => {
  if (peers[userid]) peers[userid].close()
})

peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);//calls that socket.on func from server.js
})

connectNewuser = (userid, stream) => {
  console.log("new user connected jeez!", userid)
  //calling the newly connected user!
  const call = peer.call(userid, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVidS(video, userVideoStream)
  })
  // call.on('close', () => {
  //   video.remove();
  // });
  // peers[userid] = call;

}



addVidS = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  vidgrid.append(video)

} // a func to add a vid stream
let text = $('input');
$('html').keydown((e) => {
  if (e.which == 13 && text.val().length !== 0) {
    // console.log(text.val());

    socket.emit('message', text.val());
    text.val('')
  }
}) 


socket.on("createMessage", message => {
  $("ul").append(`<li class="message"><b>User</b><br/>${message}</li><br/>`);
  console.log(message);
  scrollToBottom()
})


const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}
const muteUnmute = () => {
  const enabled = myvidS.getAudioTracks()[0].enabled;
  if (enabled) {
    myvidS.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myvidS.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myvidS.getVideoTracks()[0].enabled;
  if (enabled) {
    myvidS.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myvidS.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span> `
  document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span> `
  document.querySelector('.main_mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span> `
  document.querySelector('.main_video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main_video_button').innerHTML = html;
}
