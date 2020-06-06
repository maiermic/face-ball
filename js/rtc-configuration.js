/**
 * @type RTCConfiguration
 */
export const rtcConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.services.mozilla.com'
    },
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    // {
    //   // TODO create account
    //   urls: 'turn:numb.viagenie.ca',
    //   credential: '',
    //   username: ''
    // }
  ]
};
