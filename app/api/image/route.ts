import OpenAI from "openai";
import { NextResponse } from "next/server";


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(req: Request) {

  const { prompt } = await req.json();


  const image = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });


  return NextResponse.json({
  url: image.data?.[0]?.url,
});

}