"use client"

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"
import theme from "@/app/theme.json"

const chat = createAgentChat({
  agent: "my-agent",
  tokenUrl: "/api/an-token",
})

export function ChatComponent() {
  const { messages, sendMessage, status, stop, error } = useChat({ chat })

  return (
    <div className="w-full h-[600px] mt-8 rounded-xl overflow-hidden border border-white/10">
      <AgentChat
        messages={messages}
        onSend={(msg) =>
          sendMessage({ parts: [{ type: "text", text: msg.content }] })
        }
        status={status}
        onStop={stop}
        error={error ?? undefined}
        theme={theme}
      />
    </div>
  )
}

