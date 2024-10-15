const dotenv = require('dotenv');
const OpenAI = require("openai");
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");
const { partialConvo1, completeConvo1 } = require('./sampleConversations');

const User = z.object({
    name: z.string(),
    whatWentWell: z.array(z.string()),
    whatWentWrong: z.array(z.string()),
    whatToImprove: z.array(z.string()),
    actionItems: z.array(z.string()),
});

const Retroboard = z.object({
    users: z.array(User)
});

function getEmptyRetroboard(){
    return {
        users: []
    }
}



dotenv.config();

async function analyzeConversation(transcript, retroboard) {
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

    retroboard = completion.choices[0].message.parsed;
    return retroboard;

}


async function testOneLineAtATime(transcript){
    const lines = transcript.split('\n');
    let partialTranscript = '';
    let retroboard = getEmptyRetroboard();
    for (let i = 0; i < lines.length; i++) {
        partialTranscript += lines[i] + '\n';
        console.log(`Processing line ${i + 1}:`);
        console.log("Last line: " + lines[i]);
        if (lines[i].trim().startsWith('user:')) {
            console.log("Analyzing conversation...");
            console.log("Last line: " + lines[i]);
            retroboard = await analyzeConversation(partialTranscript, retroboard);
            printResult(retroboard);
            console.log('\n---\n');
        }
        else{
            console.log("Not a user message. Skipping analysis. Last line: " + lines[i]);
        }
    }    
}

async function oneListTest(){
    // console.log("******ANALYZING PARTIAL CONVERSATION 1******")
    // await testOneLineAtATime(partialConvo1);    
    console.log("******ANALYZING COMPLETE CONVERSATION 1******")
    await testOneLineAtATime(completeConvo1);
}

async function testAnalyzeConversation() {
    try {
        console.log("******ANALYZING PARTIAL CONVERSATION 1******")
        let retroboard = await analyzeConversation(partialConvo1);
        printResult(retroboard);
        console.log("******ANALYZING COMPLETE CONVERSATION 1******")
        retroboard = await analyzeConversation(completeConvo1);
        printResult(retroboard);
    } catch (error) {
        console.error("Error testing analyzeConversation:", error);
    }
}

async function printResult(retroboard) {
    console.log(JSON.stringify(retroboard, null, 2));
}

// testAnalyzeConversation();
oneListTest();