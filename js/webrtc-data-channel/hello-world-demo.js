import {rtcConfiguration} from "../rtc-configuration.js";

/**
 * @param signalingTarget {SignalingTarget} Used to receive/send signaling messages
 * from/to master.
 * @returns {Promise<void>}
 */
async function master(signalingTarget) {
  const peerConnection = new RTCPeerConnection(rtcConfiguration);
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      signalingTarget.sendIceCandidateToSlave(event.candidate);
    }
  };
  signalingTarget.onIceCandidateForMaster(candidate => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  });
  signalingTarget.onAnswerForMaster(sessionDescription => {
    peerConnection.setRemoteDescription(
      new RTCSessionDescription(sessionDescription));
  });
  const channel = peerConnection.createDataChannel('data');
  channel.onopen = _event => {
    channel.send('Hello World');
  };
  channel.onmessage = event => {
    alert(`received message from slave: "${event.data}"`);
  };
  const sessionDescriptionInit = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(sessionDescriptionInit);
  signalingTarget.sendOfferToSlave(sessionDescriptionInit);
}

/**
 * @param {SignalingTarget} signalingTarget Used to receive/send signaling messages
 * from/to master.
 * @returns {Promise<void>}
 */
async function slave(signalingTarget) {
  const peerConnection = new RTCPeerConnection(rtcConfiguration);
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      signalingTarget.sendIceCandidateToMaster(event.candidate);
    }
  };
  signalingTarget.onIceCandidateForSlave(candidate => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  });
  signalingTarget.onOfferForSlave(async offer => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    signalingTarget.sendAnswerToMaster(peerConnection.localDescription);
  });
  peerConnection.ondatachannel = event => {
    const channel = event.channel;
    channel.onmessage = event => {
      alert(`received message from master: "${event.data}"`);
      channel.send('Hello Master');
    };
  };
}

/**
 * @param signalingTarget {SignalingTarget} Used to exchange signaling messages
 * between master and slave.
 */
export function runHelloWorld(signalingTarget) {
  // noinspection JSIgnoredPromiseFromCall
  slave(signalingTarget); // start listening for call from master
  // noinspection JSIgnoredPromiseFromCall
  master(signalingTarget); // call slave (initiated by creating an offer)
}
