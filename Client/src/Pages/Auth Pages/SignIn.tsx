import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Logo from "/Zylo Logo.png";
import { Link } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { useUser } from "../../Hooks/useUser";
import { useNavigate } from "react-router-dom";

interface formDataType {
  username: string;
  email: string;
  password: string;
}
const apiUrl = "/api/user/login";

const SignIn = () => {
  const navigate = useNavigate();
  const saveUserInfo = useUser((state) => state.saveUserInfo);
  const [formData, setFormData] = useState<formDataType>({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState(""); // State for error message

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, email, password } = formData;
    if (!(email && password)) {
      setError("Please fill in all the required fields");
      return;
    }

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      saveUserInfo(data.rest);
      setError("");
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      navigate("/");
    } catch (error) {
      setError("Failed to register. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className="w-full md:w-1/2 md:flex hidden justify-center items-center h-auto">
        <div className="text-center">
          <img src={Logo} alt="" width={120} className="mx-auto my-auto" />
          <p className="text-gray-700 text-sm">
            Your Premier Destination for Trendsetting Finds
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-10 mt-12">
        <img src={Logo} alt="" className="mx-auto my-auto" width={40} />

        <div>
          <p className="font-semibold mt-10">Create your account</p>
          <form
            className="mt-5 space-y-2 flex flex-col"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col space-y-1">
              <label htmlFor="username" className="text-xs">
                email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                onChange={handleInputChange}
                id="email"
                value={formData.email}
                name="email"
                placeholder="email"
                className="p-2 border rounded-lg"
              />
            </div>
            <div className="flex flex-col space-y-1 relative">
              <label htmlFor="password" className="text-xs">
                password <span className="text-red-600">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={handleInputChange}
                placeholder="password"
                value={formData.password}
                className="p-2 border rounded-lg"
              />
              <span
                className="absolute right-3 top-[29px] cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
            </div>
            <button
              type="submit"
              className="bg-black p-2 text-white rounded-lg"
            >
              Login
            </button>
          </form>
        </div>
        <div className="flex flex-col justify-between items-center md:flex-row">
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-sm mt-2 text-center md:text-right">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
