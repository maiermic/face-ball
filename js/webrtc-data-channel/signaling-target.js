export class SignalingTarget {
  /**
   * @param candidateInit {RTCIceCandidateInit}
   */
  sendIceCandidateToSlave(candidateInit) {
    throw Error('Not implemented');
  }

  onIceCandidateForSlave(listener) {
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
  sendOfferToSlave(sessionDescriptionInit) {
    throw Error('Not implemented');
  }

  onOfferForSlave(listener) {
    throw Error('Not implemented');
  }

  sendSlaveIsOnlineToHost() {
    throw Error('Not implemented');
  }

  onSlaveIsOnline(listener) {
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
