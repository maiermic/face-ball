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

  sendIceCandidateToSlave(candidate) {
    this.eventTarget.dispatchEvent(
      new CustomEvent('ice-candidate-for-slave', {
        detail: candidate,
      }));
  }

  onIceCandidateForSlave(listener) {
    this.eventTarget.addEventListener(
      'ice-candidate-for-slave',
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

  sendOfferToSlave(sessionDescription) {
    this.eventTarget.dispatchEvent(
      new CustomEvent('offer-for-slave', {
        detail: sessionDescription,
      }));
  }

  onOfferForSlave(listener) {
    this.eventTarget.addEventListener(
      'offer-for-slave',
      event => listener(event.detail));
  }

  sendSlaveIsOnlineToHost() {
    // nothing to do
  }

  onSlaveIsOnline(listener) {
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
