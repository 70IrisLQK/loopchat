import LoginPhoto from "@/assets/login.png";
import Emoji from "@/assets/duck.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList } from "../../components/ui/tabs";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import validator from "validator";

const Auth = () => {
  const navigate = useNavigate();

  const { setUserInfo } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required!");
      return false;
    }
    if (!validator.isEmail(email)) {
      toast.error("Please, enter valid Email!");
      return false;
    }
    if (!validator.isLength(email, { min: 6, max: 50 })) {
      toast.error("Your Email: Must be between 6 and 50 characters long");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required!");
      return false;
    }
    if (!validator.isLength(password, { min: 6, max: 50 })) {
      toast.error("Your Password: Must be between 6 and 50 characters long");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required!");
      return false;
    }
    if (!validator.isLength(email, { min: 6, max: 50 })) {
      toast.error("Your Email: Must be between 6 and 50 characters long");
      return false;
    }
    if (!validator.isEmail(email)) {
      toast.error("Please, enter valid Email!");
      return false;
    }
    if (!validator.isLength(password, { min: 6, max: 50 })) {
      toast.error("Your Password: Must be between 6 and 50 characters long");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required!");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same!");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      } catch (error) {
        toast.error(error.response.data);
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      } catch (error) {
        toast.error(error.response.data);
      }
    }
  };

  return (
    <div
      className="h-[100vh] w-[100vw] flex items-center justify-center"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div
        className="h-[80vh] border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl flex flex-col md:flex-row"
        style={{ backgroundColor: "#E3F2FF" }}
      >
        <div className="flex flex-col gap-10 items-center justify-center p-5 w-full md:w-1/2">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Emoji} alt="welcome emoji" className="h-[70px] ml-3" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with <b>LoopChat</b>!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent w-full">
                <TabsTrigger
                  value="login"
                  className="text-black text-opacity-90 border-b-2 w-full p-3 transition-all duration-300 data-[state=active]:bg-[#6a7bbd] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-b-[#4c64a6] rounded-full"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-black text-opacity-90 border-b-2 w-full p-3 transition-all duration-300 data-[state=active]:bg-[#6a7bbd] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-b-[#4c64a6] rounded-full"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-5" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-6 bg-[#6a7bbd] transition-all duration-300 hover:bg-[#4c64a6] active:scale-95"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-6 bg-[#6a7bbd] transition-all duration-300 hover:bg-[#4c64a6] active:scale-95"
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden md:flex justify-center items-center w-full md:w-1/2">
          <img src={LoginPhoto} alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
