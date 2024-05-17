import { SVG } from '@svgdotjs/svg.js';
import '../assets/styles/styles.css';

// Your TypeScript code here

// DOM Elements
const imageInput = document.getElementById('imageInput') as HTMLInputElement;
const svgCanvas = document.getElementById('svgCanvas') as HTMLCanvasElement;
const downloadBtn = document.getElementById('downloadBtn') as HTMLAnchorElement;

// Event Listener for image input
imageInput.addEventListener('change', handleImageUpload);

function handleImageUpload(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        drawImageToCanvas(img);
        const svgString = convertToSVG(img);
        enableDownload(svgString);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function drawImageToCanvas(image: HTMLImageElement): void {
  const context = svgCanvas.getContext('2d');
  if (context) {
    svgCanvas.width = image.width;
    svgCanvas.height = image.height;
    context.clearRect(0, 0, svgCanvas.width, svgCanvas.height);
    context.drawImage(image, 0, 0);
  }
}

function convertToSVG(image: HTMLImageElement): string {
  const svg = SVG().size(image.width, image.height);
  svg.image(image.src).size(image.width, image.height);
  return svg.svg();
}

function enableDownload(svgString: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  downloadBtn.href = url;
  downloadBtn.download = 'image.svg';
  downloadBtn.style.display = 'inline'; // Show the download button
}

// Add a click event listener to the download button
downloadBtn.addEventListener('click', (event) => {
  if (!downloadBtn.href) {
    event.preventDefault();
  }
});
