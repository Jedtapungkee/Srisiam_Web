import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import DialogForm from "../address/DialogForm";
import useSrisiamStore from "../../store/Srisiam-store";

const Addresscheckout = ({ onAddressSelect }) => {
  const addresses = useSrisiamStore((state) => state.addresses);
  const getAddresses = useSrisiamStore((state) => state.getAddresses);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    getAddresses();
  }, [getAddresses]);

  useEffect(() => {
    const defaultAddr = getDisplayAddress();
    setSelectedAddress(defaultAddr);
    // ส่ง address ที่เลือกกลับไปให้ parent
    if (defaultAddr && onAddressSelect) {
      onAddressSelect(defaultAddr);
    }
  }, [addresses]);

  // Find default address or use the first one if no default is set
  const getDisplayAddress = () => {
    if (addresses.length === 0) return null;

    // If only one address, return it
    if (addresses.length === 1) return addresses[0];

    // If multiple addresses, find the default one
    const defaultAddress = addresses.find((address) => address.isDefault);

    // Return default address if found, otherwise return the first address
    return defaultAddress || addresses[0];
  };

  const handleAddressClick = () => {
    setAddressDialogOpen(true);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setAddressDialogOpen(false);
    // ส่ง address ที่เลือกกลับไปให้ parent
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  const displayAddress = selectedAddress || getDisplayAddress();

  return (
    <div>
      {/* ที่อยู่ในการจัดส่ง */}
      <div className="mb-6 p-4 border rounded shadow-sm">
        <h2 className="flex text-2xl font-medium mb-4">
          <span>
            <MapPin className="h-8 w-8 text-red-500" />
          </span>
          ที่อยู่ในการจัดส่ง
        </h2>
        {displayAddress ? (
          <div
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleAddressClick}
          >
            {/* Recipient Info */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <p className="font-bold">
                  {displayAddress.recipientFirstName}{" "}
                  {displayAddress.recipientLastName}
                </p>
                <span className="text-gray-400">|</span>
                <p className="text-gray-700">{displayAddress.phoneNumber}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>

            {/* Address Details */}
            <div className="text-gray-600">
              {displayAddress.village && (
                <div className="flex gap-2">
                  <p>{displayAddress.village}</p>
                  <p>ต.{displayAddress.subDistrict}</p>
                  <p>อ.{displayAddress.district}</p>
                  <p>จ.{displayAddress.province}</p>
                  <p>{displayAddress.zipCode}</p>
                </div>
              )}
            </div>

            {/* Default Address Indicator */}
            {displayAddress.isDefault && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  ที่อยู่หลัก
                </span>
              </div>
            )}

            <div className="mt-2 text-sm text-blue-600">
              คลิกเพื่อเปลี่ยนที่อยู่
            </div>
          </div>
        ) : (
          <div
            className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
            onClick={handleAddressClick}
          >
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p>ไม่มีที่อยู่ในการจัดส่ง</p>
            <p className="text-sm text-blue-600 mt-1">คลิกเพื่อเพิ่มที่อยู่</p>
          </div>
        )}
      </div>

      {/* Address Selection Dialog */}
      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>เลือกที่อยู่ในการจัดส่ง</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAddress?.id === address.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleAddressSelect(address)}
                >
                  {/* Recipient Info */}
                  <div className="flex items-center mb-2 gap-4">
                    <p className="font-bold">
                      {address.recipientFirstName} {address.recipientLastName}
                    </p>
                    <span className="text-gray-400">|</span>
                    <p className="text-gray-700">{address.phoneNumber}</p>
                  </div>

                  {/* Address Details */}
                  <div className="text-gray-600">
                    {address.village && (
                      <div>
                        <p>{address.village}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <p>ต.{address.subDistrict}</p>
                      <p>อ.{address.district}</p>
                      <p>จ.{address.province}</p>
                      <p>{address.zipCode}</p>
                    </div>
                  </div>

                  {/* Default Address Indicator */}
                  {address.isDefault && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        ที่อยู่หลัก
                      </span>
                    </div>
                  )}

                  {selectedAddress?.id === address.id && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        ✓ เลือกแล้ว
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="mb-2">ยังไม่มีที่อยู่ในระบบ</p>
                <p className="text-sm">
                  เพิ่มที่อยู่แรกของคุณเพื่อเริ่มต้นการจัดส่ง
                </p>
              </div>
            )}

            {/* Add New Address Button */}
            <div className="pt-4 border-t">
              <DialogForm />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Addresscheckout;
