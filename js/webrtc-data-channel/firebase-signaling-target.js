import {SignalingTarget} from "./signaling-target.js";

function doNothing() {
}

export class FirebaseSignalingTarget extends SignalingTarget {
  constructor() {
    super();
    // these function may be overwritten, but do nothing by default
    this._onIceCandidateForSlave = doNothing;
    this._onIceCandidateForMaster = doNothing;
    this._onOfferForSlave = doNothing;
    this._onSlaveIsOnline = doNothing;
    this._onAnswerForMaster = doNothing;

    this._database = firebase.database().ref();
    this._database.on('child_added', async data => {
      const msg = JSON.parse(data.val().message);
      const sender = data.val().sender;
      if (msg.ice) {
        if (sender === 'master') {
          this._onIceCandidateForSlave(msg.ice);
        } else {
          this._onIceCandidateForMaster(msg.ice);
        }
      } else if (sender === 'slave' && msg.isOnline) {
        this._onSlaveIsOnline();
      } else if (msg.sdp.type === "offer") {
        this._onOfferForSlave(msg.sdp);
      } else if (msg.sdp.type === "answer") {
        this._onAnswerForMaster(msg.sdp);
      } else {
        console.warn('unhandled SDP type', msg.sdp.type);
      }
    });
  }

  _sendMessage(userId, message) {
    this._database
      .push({
        sender: userId,
        message: JSON.stringify(message),
      })
      .remove();
  }

  _sendMessageAsMaster(message) {
    this._sendMessage('master', message);
  }

  _sendMessageAsSlave(message) {
    this._sendMessage('slave', message);
  }

  sendIceCandidateToSlave(candidate) {
    this._sendMessageAsMaster({ice: candidate});
  }

  onIceCandidateForSlave(listener) {
    this._onIceCandidateForSlave = listener;
  }

  sendIceCandidateToMaster(candidate) {
    this._sendMessageAsSlave({ice: candidate});
  }

  onIceCandidateForMaster(listener) {
    this._onIceCandidateForMaster = listener;
  }

  sendOfferToSlave(sessionDescription) {
    this._sendMessageAsMaster({sdp: sessionDescription});
  }

  onOfferForSlave(listener) {
    this._onOfferForSlave = listener;
  }

  sendSlaveIsOnlineToMaster() {
    this._sendMessageAsSlave({isOnline: true});
  }

  onSlaveIsOnline(listener) {
    this._onSlaveIsOnline = listener;
  }

  sendAnswerToMaster(sessionDescription) {
    this._sendMessageAsSlave({sdp: sessionDescription});
  }

  onAnswerForMaster(listener) {
    this._onAnswerForMaster = listener;
  }
}
