import React, { useEffect, useState, useRef } from "react";
import BreadcrumbsProfile from "./BreadcrumbsProfile";
import { Button } from "../ui/button";
import useSrisiamStore from "../../store/Srisiam-store";
import { getUserProfile, updateUserProfile, saveUserProfilePicture } from "../../api/User";
import { User, Calendar as CalendarIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { toast } from "sonner";

const UserProfile = () => {
  const token = useSrisiamStore((state) => state.token);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    picture: null,
    email: "",
    phoneNumber: "",
    birthDate: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await getUserProfile(token);
      const { firstName, lastName, picture, email, phoneNumber, birthDate } =
        res.data.user;
      setFormData({
        firstName: firstName || "",
        lastName: lastName || "",
        picture: picture || null,
        email: email || "",
        phoneNumber: phoneNumber || "",
        birthDate: birthDate ? birthDate.split('T')[0] : "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
     toast.error("ไม่สามารถโหลดข้อมูลโปรไฟล์ได้");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith('image/')) {
      toast.error("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    // ตรวจสอบขนาดไฟล์ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB");
      return;
    }

    setIsUploadingImage(true);
    
    try {
      // แปลงรูปเป็น base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result;
          const res = await saveUserProfilePicture(token, base64String);
          
          setFormData(prev => ({
            ...prev,
            picture: res.data.picture
          }));
          
          toast.success("เปลี่ยนรูปโปรไฟล์เรียบร้อยแล้ว");
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("ไม่สามารถอัปโหลดรูปภาพได้");
        } finally {
          setIsUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploadingImage(false);
      toast.error("ไม่สามารถอ่านไฟล์รูปภาพได้");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        birthDate: formData.birthDate,
      };

      await updateUserProfile(token, updateData);
      
      toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
      
      // รีเฟรชข้อมูล
      await fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  return (
    <div className="max-w-6xl mx-auto">
      <BreadcrumbsProfile />
      
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {formData.picture ? (
                  <img
                    src={formData.picture}
                    alt="User Profile"
                    className="rounded-full w-40 h-40 object-cover border-4 border-gray-200"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&size=160&background=random`;
                    }}
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                    <User size={80} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              <Button 
                onClick={handleImageClick}
                disabled={isUploadingImage}
                variant="outline"
                className="w-full border-2 border-[#050B72] text-color-[#050B72] hover:bg-[#1e3a5f] hover:text-white"
              >
                {isUploadingImage ? "กำลังอัปโหลด..." : "เลือกรูป"}
              </Button>
            </div>

            {/* Profile Information Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold mb-6">ข้อมูลผู้ใช้</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ชื่อ */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="mb-2 capitalize font-bold">ชื่อ</Label>
                  <Input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="กรุณากรอกชื่อ"
                    className="w-full"
                  />
                </div>

                {/* นามสกุล */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="mb-2 capitalize font-bold">นามสกุล</Label>
                  <Input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="กรุณากรอกนามสกุล"
                    className="w-full"
                  />
                </div>

                {/* อีเมล */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="mb-2 capitalize font-bold">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="กรุณากรอกอีเมล"
                    className="w-full bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* หมายเลขโทรศัพท์ */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="mb-2 capitalize font-bold">หมายเลขโทรศัพท์</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="กรุณากรอกหมายเลขโทรศัพท์"
                    className="w-full"
                  />
                </div>

                {/* วัน/เดือน/ปี เกิด */}
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="mb-2 capitalize font-bold flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    วัน/เดือน/ปี เกิด
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-[#1e3a5f] hover:bg-[#152a45]"
                  >
                    {isLoading ? "กำลังบันทึก..." : "บันทึก"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
