import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";
import { useMemberId } from "@/hooks/use-member-id";

export const WorkspaceSidebar = () => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();
  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#5E2C5F]">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2 bg-[#5E2C5F] text-white">
        <AlertTriangle className="size-5" />
        <p className="text-sm">Workspace not found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#5E2C5F]">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />
      </div>
      <WorkspaceSection
        label="channels"
        hint="New channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((channel) => (
          <SidebarItem
            key={channel._id}
            label={channel.name}
            icon={HashIcon}
            id={channel._id}
            variant={channelId === channel._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New direct message"
        // onNew={() => {}}
      >
        {members?.map((member) => (
          <UserItem
            key={member._id}
            id={member._id}
            label={member?.user?.name}
            image={member?.user?.image}
            variant={member._id === memberId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
