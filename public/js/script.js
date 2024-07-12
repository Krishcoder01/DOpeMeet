const socket = io();

let local ;
let remote ;
let peerConnection;


const rtcSettings={
    iceServers:[{urls:'stun:stun.l.google.com:19302'}]
}

const initialize = async () => {
    socket.on("signalinMessage" , handleSingalingMessage) ;
    local = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
    //This is asking camera and video permissions for local user
    initiateOffer()
}

const initiateOffer = async () => {
    socket.on("signalinMessage" , handleSingalingMessage) ;
    await createPeerConnection();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("signalinMessage", JSON.stringify({offer , type:"offer"}));

}


window.addEventListener('beforeunload', () => socket.disconnect());

const createPeerConnection = async () => {
    peerConnection = new RTCPeerConnection(rtcSettings);
     remote = new MediaStream();
    document.querySelector("#remoteVideo").srcObject = remote;
    document.querySelector("#remoteVideo").style.display = "block";
    document.querySelector("#localVideo").classList.add("smallFrame");

    local.getTracks().forEach(track => {
        peerConnection.addTrack(track, local);
    }) ;
    peerConnection.ontrack = (e) => {
       e.streams[0].getTracks().forEach(track => {
           remote.addTrack(track);
       })
    } ;
    peerConnection.onicecandidate = (e) => 
        e.candidate && socket.emit("signalinMessage", JSON.stringify({candidate:e.candidate , type : "candidate"}));
        
    
}
const handleSingalingMessage = async (message) => {
    const {type , offer , answer , candidate} = JSON.parse(message);

    if(type === "offer") handleOffer(offer);
    if(type === "answer") handleAnswer(answer);
    if(type === "candidate" && peerConnection) {
        peerConnection.addIceCandidate(candidate);
    } }

const handleOffer = async (offer) => {
    await createPeerConnection();
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("signalinMessage", JSON.stringify({answer , type:"answer"}));
}
const handleAnswer = async (answer) => {
    if(!peerConnection.currentRemoteDescription){
        await peerConnection.setRemoteDescription(answer);
    }
}
initialize();

