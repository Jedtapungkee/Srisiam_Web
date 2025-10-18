import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import Resize from "react-image-file-resizer";
import { removeFiles, uploadFiles } from "../../api/product";
import useEcomStore from "../../store/Srisiam-store";
import { LoaderCircle,CircleX } from "lucide-react";

const Uploadfile = ({ form, setForm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const token = useEcomStore((state) => state.token);

  // Force refresh function
  const forceRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);
  const hdlOnChange = (e) => {
    const files = e.target.files;
    if (files) {
      setIsLoading(true);
      let allfiles = form.images || [];
      for (let i = 0; i < files.length; i++) {
        //validate file type
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          toast.error(`File ${file.name} is not an image`);
          continue;
        }
        //image Resize
        Resize.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (data) => {
            //endpoint Backend
            uploadFiles(token, data)
              .then((res) => {
                // console.log(res)
                allfiles.push(res.data);
                setForm({
                  ...form,
                  images: allfiles,
                });
                setIsLoading(false);
                // Force refresh to display all uploaded images
                forceRefresh();
                toast.success("Image uploaded successfully");
              })
              .catch((error) => {
                console.log(error);
                setIsLoading(false);
                toast.error("Failed to upload image");
              });
          },
          "base64"
        );
      }
    }
  };
  // console.log(form)

  const handleDelete = (public_id) => {
    const images = form.images || [];
    removeFiles(token, public_id)
      .then((res) => {
        const filterImages = images.filter((item) => {
          return item.public_id !== public_id;
        });
        setForm({
          ...form,
          images: filterImages,
        });
        // Force refresh to display remaining images properly
        forceRefresh();
        toast.success(res.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to remove image");
      });
  };
  console.log(form.images);
  return (
    <div className="my-4">
      <div className="flex gap-2 mx-4 my-4" key={refreshKey}>
        {isLoading && <LoaderCircle className="animate-spin w-16 h-16" />}

        {form.images?.map((item, index) => (
          <div className="relative" key={`${item.public_id}-${index}-${refreshKey}`}>
            
            <img
              className="w-24 h-24 object-cover rounded hover:scale-105 transition-all duration-300"
              src={item.url}
              alt={`uploaded-${index}`}
            />
            <span
              onClick={() => handleDelete(item.public_id)}
              className="absolute top-0 right-0 bg-red-500 rounded-md cursor-pointer text-white hover:bg-red-600 transition-all duration-300"
            >
              <CircleX className="w-4 h-4 m-1" />
            </span>
          </div>
        ))}
      </div>
      <div className="">
        <input
          onChange={hdlOnChange}
          type="file"
          className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
          name="images"
          multiple
          accept="image/*"
        />
      </div>
    </div>
  );
};
export default Uploadfile;