import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import type { GenerationParameters, GhibliModel } from '@/lib/store';

interface GenerateRequestBody {
  prompt: string;
  model: GhibliModel;
  parameters: GenerationParameters;
}

export async function POST(request: Request) {
  try {
    const { prompt, model, parameters }: GenerateRequestBody = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!model || !model.modelId) {
      return NextResponse.json(
        { error: 'Model is required' },
        { status: 400 }
      );
    }

    // Initialize Hugging Face client
    const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

    // Check if the prompt already includes the required prefix
    const enhancedPrompt = prompt.toLowerCase().includes(model.promptPrefix.toLowerCase())
      ? prompt
      : `${model.promptPrefix} ${prompt}`;

    // Generate image with custom parameters
    const result = await inference.textToImage({
      model: model.modelId,
      inputs: enhancedPrompt,
      parameters: {
        negative_prompt: parameters.negativePrompt,
        num_inference_steps: parameters.steps,
        guidance_scale: parameters.guidanceScale,
        width: parameters.width,
        height: parameters.height,
      }
    });

    // Convert blob to base64
    const buffer = await result.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    return NextResponse.json({ output: [dataUrl] });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image. Make sure your Hugging Face API key is valid and the selected model is accessible.' },
      { status: 500 }
    );
  }
}
