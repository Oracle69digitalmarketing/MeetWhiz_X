import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AITask, ShareableContent } from '../types';
import WandIcon from './icons/WandIcon';
import ArrowUpTrayIcon from './icons/ArrowUpTrayIcon';
import ShareIcon from './icons/ShareIcon';

// Helper function to convert file to base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const videoFrameExtractor = (videoFile: File, onFrame: (dataUrl: string) => void) => {
    return new Promise<void>((resolve) => {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(videoFile);
        video.muted = true;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let frameCount = 0;

        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const duration = video.duration;
            const interval = duration / 10; // Extract ~10 frames

            const captureFrame = (time: number) => {
                if (time > duration || frameCount >= 10) {
                    URL.revokeObjectURL(video.src);
                    resolve();
                    return;
                }
                video.currentTime = time;
            };

            video.onseeked = () => {
                if (context) {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    onFrame(canvas.toDataURL('image/jpeg'));
                    frameCount++;
                    captureFrame(video.currentTime + interval);
                }
            };

            captureFrame(0);
        };
        video.load();
    });
};


interface CreatorStudioViewProps {
    onShare: (content: ShareableContent) => void;
}

const CreatorStudioView: React.FC<CreatorStudioViewProps> = ({ onShare }) => {
  const [activeTask, setActiveTask] = useState<AITask>(AITask.GenerateSummary);
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Generating...');
  const [error, setError] = useState<string | null>(null);
  const [apiKeySelected, setApiKeySelected] = useState(true); // Assume true initially

  useEffect(() => {
    if (activeTask === AITask.GenerateVideo) {
      checkApiKey();
    }
  }, [activeTask]);

  const checkApiKey = async () => {
    if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
        await window.aistudio.openSelectKey();
        setApiKeySelected(true); // Assume success to avoid race conditions
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      setFile(files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files) {
          handleFileChange(e.dataTransfer.files);
      }
  };
  
  const renderInputArea = () => {
    const fileInputRequired = [AITask.AnalyzeDocument, AITask.AnalyzeImage, AITask.SummarizeVideo].includes(activeTask);
    
    if (fileInputRequired) {
        return (
            <div 
                className="mt-4 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-purple-500"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                <input id="file-upload" type="file" className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
                <ArrowUpTrayIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                {file ? (
                    <p className="text-gray-700">{file.name}</p>
                ) : (
                    <p className="text-gray-500">Drag & drop a file or click to upload</p>
                )}
            </div>
        );
    }
    
    return (
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            activeTask === AITask.GenerateSummary 
            ? "Paste your meeting notes here..." 
            : "Describe the image or video you want to create..."
          }
          className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-gray-50"
          disabled={isLoading}
        />
    )
  }

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        let response: any;

        switch(activeTask) {
            case AITask.GenerateSummary:
                if (!prompt.trim()) throw new Error("Please enter some text.");
                setLoadingMessage("Generating Summary...");
                response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Generate a concise summary and a list of action items for the following text: "${prompt}"`,
                });
                setGeneratedContent({ type: 'text', data: response.text });
                break;
            
            case AITask.AnalyzeDocument:
                if (!file) throw new Error("Please upload a document.");
                setLoadingMessage("Analyzing Document...");
                let text = '';
                if(file.type === 'application/pdf') {
                    const pdf = await window.pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
                    for(let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        text += content.items.map((item: any) => item.str).join(' ');
                    }
                } else {
                    text = await file.text();
                }
                response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Summarize the key points of this document: "${text.substring(0, 10000)}"`,
                });
                setGeneratedContent({ type: 'text', data: response.text });
                break;

            case AITask.AnalyzeImage:
                 if (!file) throw new Error("Please upload an image.");
                 setLoadingMessage("Analyzing Image...");
                 const imagePart = await fileToGenerativePart(file);
                 response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [{text: "Describe this image in detail."}, imagePart] },
                 });
                 setGeneratedContent({ type: 'text', data: response.text });
                 break;

            case AITask.SummarizeVideo:
                if (!file) throw new Error("Please upload a video.");
                setLoadingMessage("Extracting frames...");
                const frames: string[] = [];
                await videoFrameExtractor(file, (frame) => frames.push(frame.split(',')[1]));
                
                setLoadingMessage("Analyzing video content...");
                const frameParts = frames.map(data => ({ inlineData: { mimeType: 'image/jpeg', data }}));
                response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [{text: "Summarize this video based on these frames."}, ...frameParts] },
                });
                setGeneratedContent({ type: 'text', data: response.text });
                break;

            case AITask.GenerateImage:
                if (!prompt.trim()) throw new Error("Please enter a prompt.");
                setLoadingMessage("Generating Image...");
                response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: prompt,
                });
                const imageUrl = `data:image/png;base64,${response.generatedImages[0].image.imageBytes}`;
                setGeneratedContent({ type: 'image', data: imageUrl });
                break;

            case AITask.GenerateVideo:
                if (!prompt.trim()) throw new Error("Please enter a prompt.");
                if (!apiKeySelected) throw new Error("Please select an API key to generate videos.");
                
                setLoadingMessage("Warming up AI engine...");
                let operation = await ai.models.generateVideos({
                    model: 'veo-3.1-fast-generate-preview',
                    prompt: prompt,
                });

                setLoadingMessage("Generating video... (this may take a minute)");
                while (!operation.done) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    operation = await ai.operations.getVideosOperation({ operation });
                }
                
                const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
                if (!videoUri) throw new Error("Video generation failed.");

                setLoadingMessage("Finalizing video...");
                const videoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
                const videoBlob = await videoResponse.blob();
                setGeneratedContent({ type: 'video', data: URL.createObjectURL(videoBlob) });
                break;
        }

    } catch (e: any) {
      console.error('Error in Creator Studio:', e);
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs: AITask[] = Object.values(AITask);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Creator Studio</h1>
      <p className="mt-2 text-gray-600 mb-6">Your AI-powered content creation and analysis hub.</p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTask(tab)} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTask === tab ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
        
        {renderInputArea()}

        {activeTask === AITask.GenerateVideo && !apiKeySelected && (
            <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                <p>Video generation requires a project API key.</p>
                <button onClick={handleSelectKey} className="mt-2 font-bold underline">Select API Key</button>
            </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isLoading || (activeTask === AITask.GenerateVideo && !apiKeySelected)}
          className="mt-4 w-full flex items-center justify-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
        >
          {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> : <WandIcon className="w-5 h-5 mr-2" />}
          {isLoading ? loadingMessage : `Generate with AI`}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {generatedContent && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Generated Output</h2>
                <button onClick={() => onShare({ title: `AI Studio Result: ${activeTask}`, text: typeof generatedContent.data === 'string' ? generatedContent.data : `Generated ${activeTask}` })} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-full">
                    <ShareIcon className="w-5 h-5" />
                </button>
            </div>
            <div>
                {generatedContent.type === 'text' && <p className="text-gray-700 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{generatedContent.data}</p>}
                {generatedContent.type === 'image' && <img src={generatedContent.data} alt="Generated" className="rounded-lg max-w-full h-auto" />}
                {generatedContent.type === 'video' && <video src={generatedContent.data} controls className="rounded-lg max-w-full h-auto" />}
            </div>
        </div>
      )}
    </div>
  );
};

export default CreatorStudioView;
