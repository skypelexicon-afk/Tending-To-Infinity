'use client';//done
import React from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { FaEdit, FaCameraRetro, FaSave } from 'react-icons/fa';
import { fetchApi } from '@/lib/doFetch';

export default function MyProfile() {
    const { user } = useAuthStore();
    const hasHydrated = useAuthStore((state) => state.hasHydrated);

    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: user?.name || '',
        phone: user?.phone || '',
        university: user?.university || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to save changes?',
        );
        if (!confirmed) return;

        try {
            const res = await fetchApi.put<
                typeof formData,
                { success: boolean; message?: string }
            >('api/users/profile', formData);

            if (res.success) {
                setIsEditing(false);
            } else {
                throw new Error(res.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('An error occurred while saving your profile.');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user?.name || '',
            phone: user?.phone || '',
            university: user?.university || '',
        });
    };

    const fieldStyle = (editing: boolean) =>
        `text-right rounded px-2 py-1 w-full border ${editing ? 'border-[#6C4CF1] bg-white' : 'border-black bg-gray-100'
        }`;

    return (
        <div className="flex justify-center items-center">
            <div //className="flex flex-col md:flex-row items-center justify-center max-w-3xl px-4 py-2 shadow-lg bg-white rounded-lg w-full gap-4 border border-gray-200"
            className="flex flex-col md:flex-row items-center justify-center max-w-3xl px-4 py-2 shadow-lg bg-yellow-800 text-yellow-800 rounded-lg w-full gap-4 border border-yellow-200">
                <div className="relative inline-block">
                    <Image
                        src="/images/default.png"
                        alt="Profile Image"
                        width={120}
                        height={120}
                        className="rounded-full"
                    />
                    <div //className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md"
                    className="absolute bottom-0 right-0 bg-yellow-200 rounded-full p-2 shadow-md"
                    >
                        <FaCameraRetro
                            size={16}
                            //className="text-gray-600 cursor-pointer"
                            className="text-yellow-900 cursor-pointer"
                        />
                    </div>
                </div>

                <div //className="flex flex-col justify-center w-full max-w-2xl p-4 shadow-lg bg-white rounded-lg mt-4 border border-gray-200"
                className="flex flex-col justify-center w-full max-w-2xl p-4 shadow-lg bg-yellow-200 rounded-lg mt-4 border border-yellow-200"
                >
                    <span className="inline-flex items-center justify-between w-full p-4">
                        <h1 className="font-bold text-lg md:text-2xl">
                            Profile Detail
                        </h1>
                        <div className="flex items-center gap-4">
                            {isEditing && (
                                <button
                                    onClick={handleCancel}
                                    className="text-sm font-semibold text-red-500"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                onClick={() =>
                                    isEditing
                                        ? handleSave()
                                        : setIsEditing(true)
                                }
                               // className="flex items-center font-semibold hover:text-gray-700 text-base"
                               className="flex items-center font-semibold hover:text-yellow-800 text-base"
                            >
                                <span className="md:inline hidden">
                                    {isEditing ? 'Save' : 'Edit'}
                                </span>
                                {isEditing ? (
                                    <FaSave size={22} className="ml-2" />
                                ) : (
                                    <FaEdit size={22} className="ml-2" />
                                )}
                            </button>
                        </div>
                    </span>

                    <div //className="flex items-center text-gray-400 px-4 w-full"
                    className="flex items-center text-yellow-800 px-4 w-full"
                    >
                        <span className="shrink-0">Personal Details</span>
                        <hr className="ml-4 flex-grow border-t border-yellow-800" />
                    </div>
                    <ul className="w-full p-4 grid grid-cols-2 gap-y-2 text-sm">
                        <li //className="text-gray-600"
                        className="text-yellow-800"
                        >Name</li>
                        <li>
                            {isEditing ? (
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={fieldStyle(true)}
                                />
                            ) : (
                                <div
                                    className={`${fieldStyle(false)} min-h-[30px] flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide`}
                                >
                                    {formData.name || (
                                        <span //className="text-gray-400"
                                        className="text-yellow-800"
                                        ></span>
                                    )}
                                </div>
                            )}
                        </li>

                        <li //className="text-gray-600"
                        className="text-yellow-800"
                        >Mobile No.</li>
                        <li>
                            {isEditing ? (
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={fieldStyle(true)}
                                />
                            ) : (
                                <div
                                    className={`${fieldStyle(false)} min-h-[30px] flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide`}
                                >
                                    {formData.phone || (
                                        <span //className="text-gray-400"
                                        className="text-yellow-800"
                                        ></span>
                                    )}
                                </div>
                            )}
                        </li>

                        <li //className="text-gray-600"
                        className="text-yellow-800"
                        >Email</li>
                        <li>
                            <div
                               // className={`min-h-[30px] text-gray-600 flex items-center overflow-x-auto scrollbar-hide whitespace-nowrap`}
                                className={`min-h-[30px] text-yellow-800 flex items-center overflow-x-auto scrollbar-hide whitespace-nowrap`}
                            >
                                {user?.email || (
                                    <span //className="text-gray-400"
                                    className="text-yellow-800"
                                    ></span>
                                )}
                            </div>

                        </li>
                    </ul>

                    <div //className="flex items-center text-gray-400 px-4 w-full"
                    className="flex items-center text-yellow-800 px-4 w-full"
                    >
                        <span className="shrink-0">Academic Details</span>
                        <hr className="ml-4 flex-grow border-t border-yellow-800" />
                    </div>
                    <ul className="w-full p-4 grid grid-cols-2 gap-y-2 text-sm">
                        <li //className="text-gray-600"
                        className='text-yellow-800'>College Name</li>
                        <li>
                            {isEditing ? (
                                <input
                                    name="university"
                                    value={formData.university}
                                    onChange={handleChange}
                                    className={fieldStyle(true)}
                                />
                            ) : (
                                <div
                                    className={`${fieldStyle(false)} min-h-[30px] flex items-center overflow-x-auto scrollbar-hide whitespace-nowrap`}
                                >
                                    {formData.university || (
                                        <span //className="text-gray-400"
                                        className='text-yellow-800'></span>
                                    )}
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
