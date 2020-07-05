import {SignalingTarget} from "./signaling-target.js";

function doNothing() {
}

export class FirebaseSignalingTarget extends SignalingTarget {
  /**
   * @param databasePath Use different database paths for different examples to
   * avoid conflicts.
   */
  constructor(databasePath) {
    super();
    // these function may be overwritten, but do nothing by default
    this._onIceCandidateForSlave = doNothing;
    this._onIceCandidateForHost = doNothing;
    this._onOfferForSlave = doNothing;
    this._onSlaveIsOnline = doNothing;
    this._onAnswerForHost = doNothing;

    this._database = firebase.database().ref(databasePath);
    this._database.on('child_added', async data => {
      const msg = JSON.parse(data.val().message);
      const sender = data.val().sender;
      console.debug('FirebaseSignalingTarget child_added', {sender, msg})
      if (msg.ice) {
        if (sender === 'host') {
          this._onIceCandidateForSlave(msg.ice);
        } else {
          this._onIceCandidateForHost(msg.ice);
        }
      } else if (sender === 'slave' && msg.isOnline) {
        this._onSlaveIsOnline();
      } else if (msg.sdp.type === "offer") {
        this._onOfferForSlave(msg.sdp);
      } else if (msg.sdp.type === "answer") {
        this._onAnswerForHost(msg.sdp);
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

  _sendMessageAsHost(message) {
    this._sendMessage('host', message);
  }

  _sendMessageAsSlave(message) {
    this._sendMessage('slave', message);
  }

  sendIceCandidateToSlave(candidate) {
    this._sendMessageAsHost({ice: candidate});
  }

  onIceCandidateForSlave(listener) {
    this._onIceCandidateForSlave = listener;
  }

  sendIceCandidateToHost(candidate) {
    this._sendMessageAsSlave({ice: candidate});
  }

  onIceCandidateForHost(listener) {
    this._onIceCandidateForHost = listener;
  }

  sendOfferToSlave(sessionDescription) {
    this._sendMessageAsHost({sdp: sessionDescription});
  }

  onOfferForSlave(listener) {
    this._onOfferForSlave = listener;
  }

  sendSlaveIsOnlineToHost() {
    this._sendMessageAsSlave({isOnline: true});
  }

  onSlaveIsOnline(listener) {
    this._onSlaveIsOnline = listener;
  }

  sendAnswerToHost(sessionDescription) {
    this._sendMessageAsSlave({sdp: sessionDescription});
  }

  onAnswerForHost(listener) {
    this._onAnswerForHost = listener;
  }
}
