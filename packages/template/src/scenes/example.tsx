import {Video, makeScene2D} from '@motion-canvas/2d';
import {
  createRef,
  waitFor,
} from '@motion-canvas/core';
import vid from "../vid/example.mp4"

export default makeScene2D(function* (view) {
  
  const exampleVid = createRef<Video>();
  view.add(<Video ref={exampleVid} src={vid}></Video>)

  exampleVid().play()
  yield* waitFor(7)

});
