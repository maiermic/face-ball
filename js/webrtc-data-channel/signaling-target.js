export class SignalingTarget {
  /**
   * @param candidateInit {RTCIceCandidateInit}
   */
  sendIceCandidateToClient(candidateInit) {
    throw Error('Not implemented');
  }

  onIceCandidateForClient(listener) {
    throw Error('Not implemented');
  }

  /**
   * @param candidateInit {RTCIceCandidateInit}
   */
  sendIceCandidateToHost(candidateInit) {
    throw Error('Not implemented');
  }

  onIceCandidateForHost(listener) {
    throw Error('Not implemented');
  }

  /**
   * @param sessionDescriptionInit {RTCSessionDescriptionInit}
   */
  sendOfferToClient(sessionDescriptionInit) {
    throw Error('Not implemented');
  }

  onOfferForClient(listener) {
    throw Error('Not implemented');
  }

  sendClientIsOnlineToHost() {
    throw Error('Not implemented');
  }

  onClientIsOnline(listener) {
    throw Error('Not implemented');
  }

  /**
   * @param sessionDescriptionInit {RTCSessionDescriptionInit}
   */
  sendAnswerToHost(sessionDescriptionInit) {
    throw Error('Not implemented');
  }

  onAnswerForHost(listener) {
    throw Error('Not implemented');
  }
}
