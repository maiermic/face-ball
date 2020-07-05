import {rtcConfiguration} from "../rtc-configuration.js";

/**
 * @param signalingTarget {SignalingTarget} Used to receive/send signaling messages
 * from/to host.
 * @returns {Promise<void>}
 */
export async function host(signalingTarget) {
  const peerConnection = new RTCPeerConnection(rtcConfiguration);
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      signalingTarget.sendIceCandidateToSlave(event.candidate);
    }
  };
  signalingTarget.onIceCandidateForHost(candidate => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  });
  signalingTarget.onAnswerForHost(sessionDescription => {
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

  async function createOffer() {
    const sessionDescriptionInit = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(sessionDescriptionInit);
    signalingTarget.sendOfferToSlave(sessionDescriptionInit);
  }

  signalingTarget.onSlaveIsOnline(createOffer);

  await createOffer();
}

/**
 * @param {SignalingTarget} signalingTarget Used to receive/send signaling messages
 * from/to host.
 * @returns {Promise<void>}
 */
export async function slave(signalingTarget) {
  const peerConnection = new RTCPeerConnection(rtcConfiguration);
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      signalingTarget.sendIceCandidateToHost(event.candidate);
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
    signalingTarget.sendAnswerToHost(peerConnection.localDescription);
  });
  peerConnection.ondatachannel = event => {
    const channel = event.channel;
    channel.onmessage = event => {
      alert(`received message from host: "${event.data}"`);
      channel.send('Hello Host');
    };
  };
  // tell host that slave is online by sending an offer
  signalingTarget.sendSlaveIsOnlineToHost();
}

/**
 * @param signalingTarget {SignalingTarget} Used to exchange signaling messages
 * between host and slave.
 */
export function runHelloWorld(signalingTarget) {
  // noinspection JSIgnoredPromiseFromCall
  slave(signalingTarget); // start listening for call from host
  // noinspection JSIgnoredPromiseFromCall
  host(signalingTarget); // call slave (initiated by creating an offer)
}
