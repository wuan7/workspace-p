import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder?: string;
  conversationId: Id<"conversations">;
}

type CreateMesageValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

export const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const workspaceId = useWorkspaceId();

  const editorRef = useRef<Quill | null>(null);

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    console.log({ body, image });
    try {
      setIsPending(true);
      editorRef.current?.enable(false);
      const values: CreateMesageValues = {
        conversationId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Url not found");
        }
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage(values, { throwError: true });
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  return (
    <Editor
      key={editorKey}
      variant="create"
      placeholder={placeholder}
      onSubmit={handleSubmit}
      disabled={isPending}
      innerRef={editorRef}
    />
  );
};
