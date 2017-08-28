'use strict';

class Sprite {
    constructor(context, width, height, image, data) {
      let img = new Image();
      img.src = 'img/' + image;
      img.onload = () => {
        this.render();
      }
      context.imageSmoothingEnabled = false;

      Object.assign(this, {
        context,
        width,
        height,
        image: img,
        data: data || {current: '', parts: {}},
      });
    }
    
    /**
     * Update current sprite part
     */
    update(partId) {
      this.data.current = partId;
    }

    render() {
      // clear current space (TODO: update when we use positions)
      this.context.clearRect(0, 0, this.width*2, this.height*2);
      let part = this.data.parts[this.data.current];
      this.context.drawImage(
         this.image,
         part[0],
         part[1],
         this.width,
         this.height,
         0, // x canvas pos
         0, // y canvas pos
         this.width * 2,  // add scaling?
         this.height * 2
      );
    }
  }
