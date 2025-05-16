function addSineSection(playbackRate, fund){

  var playbackRate = playbackRate;
  var fund = fund;

  var pArray = [P5, M3, P4, M6, 2, M2*2, M3*2, P4*2];

  for(var i=0; i<4; i++){

    addSine3(s1+i+randomFloat(0.5, 1),  s6+1,   fund*4, pArray, playbackRate, 0.125);
    addSine(s2+i+randomFloat(0.5, 1),   s6+1,   fund*2, pArray, playbackRate, 0.175);
    addSine2(s3+i+randomFloat(0.5, 1),  s6+1,   fund,   pArray, playbackRate, 0.15);
    addSine3(s4+i+randomFloat(0.5, 1),  s6+1,   fund*4, pArray, playbackRate*2, 0.03125*0.5);
    addSine3(s4+i+randomFloat(0.5, 1),  s6+1,   fund*1, pArray, playbackRate*8, 0.03125*0.5);

  }

  for(var i=0; i<4; i++){

    addSine3(s6+i+randomFloat(0.5, 1), s10+1,   fund*4, pArray, playbackRate, 0.125);

    addSine(s7+i+randomFloat(0.5, 1),  s10+1,   fund*2, pArray, playbackRate, 0.175);

    addSine3(s8+i+randomFloat(0.5, 1), s10+1,   fund*4, pArray, playbackRate*2, 0.0625);
    addSine3(s8+i+randomFloat(0.5, 1), s10+1,   fund*1, pArray, playbackRate*4, 0.0625);

    addSine2(s9+i+randomFloat(0.5, 1), s10+1,   fund,   pArray, playbackRate, 0.2);

  }

}
