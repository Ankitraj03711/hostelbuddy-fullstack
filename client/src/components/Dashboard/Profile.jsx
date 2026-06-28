import React, { useState } from "react";
import { fetchUser } from "../../utility/userLocalStorage";

export const Profile = () => {
  const loggedInUser = fetchUser();

  const [userInfo, setUserInfo] = useState({
    name: loggedInUser?.name || "",
    email: loggedInUser?.email || "",
    batchYear: loggedInUser?.batchYear || "",
    hostel: loggedInUser?.hostel || "",
    phone: loggedInUser?.phone || "",
    room: loggedInUser?.room || "",
    profilePic: loggedInUser?.profileImage || null,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // TODO: Send updated profile to backend
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setUserInfo((prevState) => ({
          ...prevState,
          profilePic: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-14 px-24 border rounded shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold">Personal Profile</h2>
      </div>

      <div className="flex items-center mb-4 gap-10">
        <div className="flex-shrink-0">
          <img
            src={userInfo.profilePic || "/ankit.png"}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover"
          />

          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block text-sm mt-2 w-48"
            />
          )}
        </div>

        <div className="ml-4 flex-1">
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block text-5xl bg-white w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Batch Year:</label>
          <input
            type="text"
            name="batchYear"
            value={userInfo.batchYear}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Hostel:</label>
          <input
            type="text"
            name="hostel"
            value={userInfo.hostel}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone:</label>
          <input
            type="text"
            name="phone"
            value={userInfo.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Room No:</label>
          <input
            type="text"
            name="room"
            value={userInfo.room}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        {isEditing ? (
          <>
            <button
              onClick={handleCancelClick}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveClick}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
          </>
        ) : (
          <button
            onClick={handleEditClick}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};