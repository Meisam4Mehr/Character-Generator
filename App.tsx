
import React, { useState, useCallback } from 'react';
import { generateImageFromPrompt } from './services/geminiService';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SparklesIcon, ExclamationTriangleIcon } from './components/Icons';

const App: React.FC = () => {
  const initialPrompt = "A 3D image of a boy animation character. The character should wear a yellow industrial hard hat, yellow overalls, a blue denim shirt, and black shoes, Glasses, black gloves. He is standing. Full body. tall. white background. High resolution";
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for the character.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const generatedImageUrl = await generateImageFromPrompt(prompt);
      setImageUrl(generatedImageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate image. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            3D Character Generator
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Describe your character and bring it to life with AI.
          </p>
        </header>

        <main className="bg-gray-800/50 rounded-2xl shadow-2xl shadow-purple-500/10 p-6 md:p-8 backdrop-blur-sm border border-gray-700">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label htmlFor="prompt" className="mb-2 font-semibold text-gray-300">
                Character Description
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A brave knight with shining armor..."
                className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-shadow text-gray-200 resize-none"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleGenerateImage}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/30"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Generate Image
                </>
              )}
            </button>
          </div>

          <div className="mt-8">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
                <ExclamationTriangleIcon />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-6 w-full aspect-square bg-gray-900/70 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden">
              {isLoading && (
                <div className="text-center text-gray-400">
                  <LoadingSpinner className="w-12 h-12 mx-auto mb-4" />
                  <p className="font-semibold">Generating your character...</p>
                  <p className="text-sm">This may take a moment.</p>
                </div>
              )}
              {!isLoading && !imageUrl && (
                 <div className="text-center text-gray-500 p-8">
                    <SparklesIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">Your generated image will appear here.</p>
                    <p className="text-sm">Click "Generate Image" to start.</p>
                </div>
              )}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Generated 3D character"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
