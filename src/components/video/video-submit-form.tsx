"use client";

import { handleVideoSubmit } from "@/app/actions"
import { SubmitButton } from "@/components/submit-button"
import { PromptInput, PromptInputTextarea, PromptInputActions } from "@/components/ui/prompt-input"
import { useState } from "react";

export function VideoSubmitForm() {
  const [input, setInput] = useState("")
  return (
    <form action={handleVideoSubmit} className="space-y-4">
      <PromptInput
        value={input}
        onValueChange={(value) => setInput(value)}>
        <PromptInputTextarea
          name="videoUrl"
          placeholder="Paste YouTube link here..."
          className="bg-transparent!"
          required
        />
        <PromptInputActions className="justify-end pt-2">
          <SubmitButton label="Submit" />
        </PromptInputActions>
      </PromptInput>
    </form>
  )
}
