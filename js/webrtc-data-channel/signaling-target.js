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
  sendIceCandidateToMaster(candidateInit) {
    throw Error('Not implemented');
  }

  onIceCandidateForMaster(listener) {
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

  sendSlaveIsOnlineToMaster() {
    throw Error('Not implemented');
  }

  onSlaveIsOnline(listener) {
    throw Error('Not implemented');
  }

  /**
   * @param sessionDescriptionInit {RTCSessionDescriptionInit}
   */
  sendAnswerToMaster(sessionDescriptionInit) {
    throw Error('Not implemented');
  }

  onAnswerForMaster(listener) {
    throw Error('Not implemented');
  }
}
