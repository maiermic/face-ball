import {SignalingTarget} from "./signaling-target.js";

export class LocalSignalingTarget extends SignalingTarget {
  /**
   * @type EventTarget
   */
  eventTarget;

  /**
   * @param eventTarget {EventTarget}
   */
  constructor(eventTarget) {
    super();
    this.eventTarget = eventTarget;
  }

  sendIceCandidateToClient(candidate) {
    this.eventTarget.dispatchEvent(
      new CustomEvent('ice-candidate-for-client', {
        detail: candidate,
      }));
  }

  onIceCandidateForClient(listener) {
    this.eventTarget.addEventListener(
      'ice-candidate-for-client',
      event => listener(event.detail));
  }

  sendIceCandidateToHost(candidate) {
    this.eventTarget.dispatchEvent(
      new CustomEvent('ice-candidate-for-host', {
        detail: candidate,
      }));
  }

  onIceCandidateForHost(listener) {
    this.eventTarget.addEventListener(
      'ice-candidate-for-host',
      event => listener(event.detail));
  }

  sendOfferToClient(sessionDescription) {
    this.eventTarget.dispatchEvent(
      new CustomEvent('offer-for-client', {
        detail: sessionDescription,
      }));
  }

  onOfferForClient(listener) {
    this.eventTarget.addEventListener(
      'offer-for-client',
      event => listener(event.detail));
  }

  sendClientIsOnlineToHost() {
    // nothing to do
  }

  onClientIsOnline(listener) {
    // nothing to do
  }

  sendAnswerToHost(sessionDescription) {
    this.eventTarget.dispatchEvent(
      new CustomEvent('answer-for-host', {
        detail: sessionDescription,
      }));

  }

  onAnswerForHost(listener) {
    this.eventTarget.addEventListener(
      'answer-for-host',
      event => listener(event.detail));
  }
}
