import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { colors } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import profileBg from "@/assets/profile.png";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";
import validator from "validator";
const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, setIsUploading, setFileUploadProgress } =
    useAppStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color); // Initialize color from user info
    }
    if (userInfo.image) {
      setImage(`${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!validator.isLength(firstName, { min: 3, max: 50 })) {
      toast.error("Your First Name: Must be between 3 and 50 characters long");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    if (!validator.isLength(lastName, { min: 3, max: 50 })) {
      toast.error("Your Last Name: Must be between 3 and 50 characters long");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            color: selectedColor, // Include color in the request
          },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data }); // Update user info with new data
          toast.success("Profile updated successfully!");
          navigate("/chat");
        }
      } catch (error) {
        toast.error("An error occurred while updating the profile.");
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please set up profile!");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("profile-image", file);

        setIsUploading(true);
        const response = await apiClient.post(
          ADD_PROFILE_IMAGE_ROUTE,
          formData,
          {
            withCredentials: true,

            onUploadProgress: (data) => {
              setFileUploadProgress(
                Math.round((100 * data.loaded) / data.total)
              );
            },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200 && response.data.image) {
          setIsUploading(false);
          setUserInfo({ ...userInfo, image: response.data.image });
          toast.success("Image updated successfully!");
        }
      }
    } catch (error) {
      setIsUploading(false);
      toast.error(error.response.data);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully!");
        setImage(null);
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <div className="bg-[#1c1d25] h-[100vh] w-[100vw] flex items-center justify-center">
      <div
        className="h-[80vh] border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl flex flex-col items-center justify-center relative"
        style={{
          backgroundImage: `url(${profileBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-5 left-5">
          <div
            className="rounded-full border-2 border-gray-700 p-2 cursor-pointer shadow-md transition-transform transform hover:scale-105 active:scale-95 active:shadow-sm"
            onClick={handleNavigate}
          >
            <IoArrowBack className="text-4xl lg:text-6xl text-black/90" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center justify-center w-full px-5">
          <div className="flex flex-col items-center">
            <div
              className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center mx-auto"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-gray-700 shadow-lg shadow-gray-500/50">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedColor
                    )}`}
                  >
                    {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
                  </div>
                )}
              </Avatar>
              {hovered && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                  onClick={image ? handleDeleteImage : handleFileInputClick}
                >
                  {image ? (
                    <FaTrash className="text-white text-3xl cursor-pointer" />
                  ) : (
                    <FaPlus className="text-white text-3xl cursor-pointer" />
                  )}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
                name="profile-image"
                accept=".png,.jpg, .jpeg, .svg, .webp"
              />
            </div>
            <div className="flex gap-5 mt-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 border-2 border-gray-700 ${
                    selectedColor === index ? "bg-opacity-70" : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5 text-black items-center justify-center w-full">
            <Input
              placeholder="Email"
              type="email"
              disabled
              value={userInfo.email}
              className="rounded-full p-6 bg-[#2c2e3b] text-white border-none w-full md:w-3/4"
            />
            <Input
              placeholder="First Name"
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              className="rounded-full p-6 bg-[#2c2e3b] text-white border-none w-full md:w-3/4"
            />
            <Input
              placeholder="Last Name"
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              className="rounded-full p-6 bg-[#2c2e3b] text-white border-none w-full md:w-3/4"
            />
          </div>
        </div>
        <Button
          className="rounded-full p-6 bg-[#6a7bbd] transition-all duration-300 hover:bg-[#4c64a6] active:scale-95 mt-5 shadow-[#4c64a6] active:shadow-none"
          onClick={saveChanges}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
