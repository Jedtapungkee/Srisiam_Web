import useSrisiamStore from "../../store/Srisiam-store";
import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { removeAddress } from "../../api/Address";
import Swal from "sweetalert2";
import { toast } from "sonner";
import DialogFormEditAddress from "./DialogFormEditAddress";
const ListAddress = () => {
  const addresses = useSrisiamStore((state) => state.addresses);
  const getAddresses = useSrisiamStore((state) => state.getAddresses);
  const token = useSrisiamStore((state) => state.token);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    getAddresses();
  }, [getAddresses]);

  const handleEdit = (addressId) => {
    setSelectedAddressId(addressId);
    setEditDialogOpen(true);
  };

  const handleRemove = async (id) => {
    Swal.fire({
      title: "แน่ในใจหรือไม่?",
      text: `คุณต้องการลบที่อยู่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await removeAddress(token, id);
          toast.success(`ลบที่อยู่สำเร็จ`);
          getAddresses();
        } catch (error) {
          console.log(error);
          toast.error("ไม่สามารถลบที่อยู่ได้");
        }
      }
    });
  };

  return (
    <div>
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="bg-gray-50 rounded-full p-6 mb-4">
            <MapPin className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            ยังไม่มีที่อยู่ในระบบ
          </h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">
            คุณยังไม่ได้เพิ่มที่อยู่สำหรับการจัดส่งสินค้า
            กรุณาเพิ่มที่อยู่เพื่อความสะดวกในการสั่งซื้อ
          </p>
        </div>
      ) : (
        <div>
          {/* card ที่อยู่ */}
          <h2 className="text-2xl font-bold">ที่อยู่</h2>

          {addresses.map((item) => (
            <div key={item.id} className="flex justify-between  border-b-2 p-4 mt-4">
              {/* ฝั่งซ้าย */}
              <div>
                <div className="flex items-center mb-2 gap-4">
                  <p className="font-bold">
                    {item.recipientFirstName} {item.recipientLastName}
                  </p>
                  <span> |</span>
                  <p>{item.phoneNumber}</p>
                </div>
                <div className="text-gray-600">
                  <div>
                    <p>{item.village}</p>
                  </div>
                  <div className="flex gap-2">
                    <p>ต.{item.subDistrict}</p>
                    <p>อ.{item.district}</p>
                    <p>จ.{item.province}</p>
                    <p>{item.zipCode}</p>
                  </div>
                </div>
              </div>
              {/* ฝั่งขวา */}
              <div className="flex items-center gap-2">
                <button 
                  className="hover:text-gray-500 cursor-pointer"
                  onClick={() => handleEdit(item.id)}
                >
                  แก้ไข
                </button>
                <button
                  className="text-red-500 hover:text-red-300 cursor-pointer"
                  onClick={() => handleRemove(item.id)}
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Dialog สำหรับแก้ไขที่อยู่ */}
      <DialogFormEditAddress
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        addressId={selectedAddressId}
      />
    </div>
  );
};

export default ListAddress;
