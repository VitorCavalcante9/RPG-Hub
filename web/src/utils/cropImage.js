const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

module.exports = {
  getCroppedImg: async (imageSrc, crop) => {
    const image = await createImage(imageSrc);
    console.log(image);
    console.log(crop);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    /* setting canvas width & height allows us to 
    resize from the original image resolution */
    canvas.width = crop.width;
    canvas.height = crop.height;

    var inputMIME = imageSrc.split(",")[0].split(":")[1].split(";")[0];

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, inputMIME);
    });
  },
};
