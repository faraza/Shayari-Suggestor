import { isConversationUpdate } from '../../types/conversation'
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { Retroboard } from "@/app/types/retroboard";
import { NextRequest, NextResponse } from 'next/server'; // For the App Router



async function analyzeConversation(transcript: string, retroboard: Retroboard) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });


    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
            { role: "system", content: "You will create sprint retrospective board based on the conversation. First, identify all the participants. They are announced in the beginning of the conversation. Figure out which speaker is talking is based on the context. Then, for each speaker, parse out what they said went well and make that a list of short bullet points. Then, parse out what they said went wrong and make that a list of short bullet points. Then, parse out what they said could be improved and make that a list of short bullet points. Then, parse out the action items and assign them to the appropriate user. If a user hasn't spoken yet besides introducing themselves, put them in the retroboard but leave the bullet points empty. If no users have introduced themselves, leave the users array empty. Here is the existing retroboard. Change it based on the conversation if necessary: " + JSON.stringify(retroboard, null, 2) },
            { role: "user", content: transcript }
        ],
        response_format: zodResponseFormat(Retroboard, "retrospectiveBoard"),
    });

    const parsedMessage = completion.choices[0].message.parsed;
    if (parsedMessage) {
        retroboard = parsedMessage;
        return retroboard;
    }
    throw new Error("Parsed message is null");
}


export async function POST(req: NextRequest) {
    try {
        let { message, retroboard } = await req.json();

        if (!isConversationUpdate(message)) {
            return NextResponse.json({ error: "Invalid conversation format" }, { status: 400 });
        }

        // Delete this. Just for testing
        // const lastMessage = message.conversation[message.conversation.length - 1];
        // const lastSentence = lastMessage.content.split('.').pop()?.trim() || lastMessage.content;

        // // Return the last sentence instead of processing with OpenAI
        // return NextResponse.json({ lastSentence });

        //TODO: Actually analyze the conversation

        const transcript = message.conversation.map(message => message.content).join(' ');
        retroboard = await analyzeConversation(transcript, retroboard);

        return NextResponse.json({ retroboard });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
