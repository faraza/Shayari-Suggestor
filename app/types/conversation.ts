export type ConversationUpdate = {
    type: "conversation-update";
    conversation: Array<{
        role: string;
        content: string;
    }>;
    messages?: Array<{
        role: string;
        message: string;
        time: number;
        endTime?: number;
        secondsFromStart: number;
        duration?: number;
        source?: string;
    }>;
    messagesOpenAIFormatted?: Array<{
        role: string;
        content: string;
    }>;
};

export function isConversationUpdate(obj: any): obj is ConversationUpdate {
    return obj && obj.type === "conversation-update" &&
        Array.isArray(obj.conversation) &&
        Array.isArray(obj.messages) &&
        Array.isArray(obj.messagesOpenAIFormatted);
}