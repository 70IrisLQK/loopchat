import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] bg-[#050406] border-b-2 border-[#2f303b] flex items-center justify-between px-8">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 relative">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-700">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.charAt(0)
                      : selectedChatData.email.charAt(0)}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>
          <div className="text-white">
            {selectedChatType === "contact" && selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="bg-[#2f303b] rounded-full flex items-center justify-center p-3 hover:bg-[#3a3d42] focus:outline-none"
            onClick={closeChat}
          >
            <RiCloseFill className="text-xl text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
