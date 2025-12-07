# TODO

- [ ] Loading Animation : Rethink text, typography, design, animations
- [ ] Smooth transition from loading animation to the landing page
- [ ] Paticles Animation: Improve, too distracting right now, and very basic. Make it more interesting, more relevant.
- [ ] Paticles Animation: Change (tone down) as we scroll down
- [ ] Improve Landing Page: Physicist • Developer • Philosopher animation
- [ ] Add CV pdf
- [ ] Worldline:
  - [ ] Make a better narrative
  - [ ] Ideate and Design Graphics
  - [ ] Add graphcs and animations to website
  - [ ] Better and smoother scroll animations and sync with graphcs animations
  - [ ] Fix timeline ending animations
- [ ] Interests Manifold
  - [ ] Latency and efficiency
  - [ ] Neatness - Heading + Graph
  - [ ] Responsiveness
  - [ ] Better Content and Linking



## Details

### 1. Loading Animation
1. **Change the text**: Replace "Hello, Universe" with your own greeting
2. **Adjust timing**: Make animations faster/slower by changing `duration`
3. **Different easing**: Try `"elastic.out"` for a bouncy effect
4. **Different exit**: Instead of pendulum, try:
   - `scale: 0` — Shrink to nothing
   - `y: '-100vh'` — Fly up off screen
   - `rotationY: 90` — Flip away (3D effect)
5. **Add more text**: Add a third line with another `.from()` in the timeline
6. **Add sound**: Play an audio file when animation completes
