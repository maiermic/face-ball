import {SignalingTarget} from "./signaling-target.js";
import {runHelloWorld} from "./hello-world-demo.js";

class LocalSignalingTarget extends SignalingTarget {
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

  sendIceCandidateToMaster(candidate) {
    this.eventTarget.dispatchEvent(
      new CustomEvent('ice-candidate-for-master', {
        detail: candidate,
      }));
  }

  onIceCandidateForMaster(listener) {
    this.eventTarget.addEventListener(
      'ice-candidate-for-master',
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

  sendAnswerToMaster(sessionDescription) {
    this.eventTarget.dispatchEvent(
      new CustomEvent('answer-for-master', {
        detail: sessionDescription,
      }));

  }

  onAnswerForMaster(listener) {
    this.eventTarget.addEventListener(
      'answer-for-master',
      event => listener(event.detail));
  }
}

runHelloWorld(new LocalSignalingTarget(document));
