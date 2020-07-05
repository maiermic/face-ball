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
    this._onIceCandidateForClient = doNothing;
    this._onIceCandidateForHost = doNothing;
    this._onOfferForClient = doNothing;
    this._onClientIsOnline = doNothing;
    this._onAnswerForHost = doNothing;

    this._database = firebase.database().ref(databasePath);
    this._database.on('child_added', async data => {
      const msg = JSON.parse(data.val().message);
      const sender = data.val().sender;
      console.debug('FirebaseSignalingTarget child_added', {sender, msg})
      if (msg.ice) {
        if (sender === 'host') {
          this._onIceCandidateForClient(msg.ice);
        } else {
          this._onIceCandidateForHost(msg.ice);
        }
      } else if (sender === 'client' && msg.isOnline) {
        this._onClientIsOnline();
      } else if (msg.sdp.type === "offer") {
        this._onOfferForClient(msg.sdp);
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

  _sendMessageAsClient(message) {
    this._sendMessage('client', message);
  }

  sendIceCandidateToClient(candidate) {
    this._sendMessageAsHost({ice: candidate});
  }

  onIceCandidateForClient(listener) {
    this._onIceCandidateForClient = listener;
  }

  sendIceCandidateToHost(candidate) {
    this._sendMessageAsClient({ice: candidate});
  }

  onIceCandidateForHost(listener) {
    this._onIceCandidateForHost = listener;
  }

  sendOfferToClient(sessionDescription) {
    this._sendMessageAsHost({sdp: sessionDescription});
  }

  onOfferForClient(listener) {
    this._onOfferForClient = listener;
  }

  sendClientIsOnlineToHost() {
    this._sendMessageAsClient({isOnline: true});
  }

  onClientIsOnline(listener) {
    this._onClientIsOnline = listener;
  }

  sendAnswerToHost(sessionDescription) {
    this._sendMessageAsClient({sdp: sessionDescription});
  }

  onAnswerForHost(listener) {
    this._onAnswerForHost = listener;
  }
}
