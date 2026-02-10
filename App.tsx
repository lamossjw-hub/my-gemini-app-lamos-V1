
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Spinner } from './components/Spinner';
import { generateImages } from './services/geminiService';
import { ImageFile, ImageSizeOption } from './types';
import { IMAGE_SIZE_OPTIONS } from './constants';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [refA, setRefA] = useState<ImageFile | null>(null);
  const [refB, setRefB] = useState<ImageFile | null>(null);
  const [refC, setRefC] = useState<ImageFile | null>(null);
  const [refD, setRefD] = useState<ImageFile | null>(null);

  const [prompt, setPrompt] = useState<string>('');
  const [imageSize, setImageSize] = useState<string>(IMAGE_SIZE_OPTIONS[0].value);
  const [numImages, setNumImages] = useState<number>(1);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!originalImage) {
      setError('Please upload an original image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const selectedSizeOption = IMAGE_SIZE_OPTIONS.find(opt => opt.value === imageSize);
      if (!selectedSizeOption) {
        throw new Error('Invalid image size selected');
      }
      
      const referenceImages = [refA, refB, refC, refD].filter((img): img is ImageFile => img !== null);

      const results = await generateImages(
        prompt,
        originalImage,
        referenceImages,
        selectedSizeOption,
        numImages
      );
      setGeneratedImages(results);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, refA, refB, refC, refD, prompt, imageSize, numImages]);
  

  return (
    <div className="min-h-screen text-white font-sans p-4 sm:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-2">
            Gemini Image Editor
          </h1>
          <p className="text-gray-400 text-lg">
            Craft stunning images by combining an original, references, and your creative prompts.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ImageUploader label="ori a" size="large" onImageUpload={setOriginalImage} />
          <div className="grid grid-cols-2 gap-6">
            <ImageUploader label="ref a" size="small" onImageUpload={setRefA} />
            <ImageUploader label="ref b" size="small" onImageUpload={setRefB} />
            <ImageUploader label="ref c" size="small" onImageUpload={setRefC} />
            <ImageUploader label="ref d" size="small" onImageUpload={setRefD} />
          </div>
        </div>

        <div className="bg-[#1e1f20] p-6 rounded-2xl mb-8 border border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-blue-300 mb-2">Prompt</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Make ori A look like a watercolor painting, using the color palette from ref a."
                className="w-full h-28 bg-[#2a2b2c] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="image-size" className="block text-sm font-medium text-blue-300 mb-2">Image Size</label>
                <select
                  id="image-size"
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                  className="w-full bg-[#2a2b2c] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                >
                  {IMAGE_SIZE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="num-images" className="block text-sm font-medium text-blue-300 mb-2">Number of Images</label>
                <select
                  id="num-images"
                  value={numImages}
                  onChange={(e) => setNumImages(Number(e.target.value))}
                  className="w-full bg-[#2a2b2c] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                >
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !originalImage}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        <div className="bg-[#1e1f20] p-6 rounded-2xl min-h-[400px] flex items-center justify-center border border-gray-700/50">
          {isLoading ? (
             <div className="text-center text-gray-400">
                <Spinner large={true} />
                <p className="mt-4">Generating your images... this may take a moment.</p>
             </div>
          ) : error ? (
            <div className="text-center text-red-400">
              <p><strong>Error:</strong> {error}</p>
            </div>
          ) : generatedImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {generatedImages.map((src, index) => (
                <img key={index} src={src} alt={`Generated image ${index + 1}`} className="w-full h-full object-contain rounded-lg" />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Your generated image will appear here.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
