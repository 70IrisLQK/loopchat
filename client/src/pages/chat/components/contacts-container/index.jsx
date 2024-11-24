import ProfileInfo from "./components/profile-info";
import logoText from "/public/logo.png";
import NewDm from "./components/new-dm";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";
import { Link } from "react-router-dom";

const ContactsContainer = () => {
  const { setDirectMessagesContacts, directMessagesContacts } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
          withCredentials: true,
        });
        if (response.data.contacts) {
          setDirectMessagesContacts(response.data.contacts);
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    getContacts();
  }, [setDirectMessagesContacts]);

  return (
    <div className="relative w-full sm:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#0e0e10] border-r-2 border-[#2f303b]">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Messages" />
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>

      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5 mt-0 justify-start items-center gap-4">
      <Link to="/chat">
        <img src={logoText} alt="LoopChat Logo Text" width="300" height="20" />{" "}
      </Link>
      {/* Adjust the width and height as needed */}
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-[#6a7bbd] pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
