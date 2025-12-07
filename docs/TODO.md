# TODO

- [ ] Loading Animation : Rethink text, typography, design, animations
- [ ]  



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
