import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { listCategory } from "../api/Category";
import { listEducationLevels } from "../api/EducationLevel";
import { listProduct } from "../api/Product";
import { listAddress,  } from "../api/Address";
import API_BASE_URL from "../config/api";
import _ from "lodash";

const SrisiamStore = (set, get) => ({
  user: null,
  token: null,
  categories: [],
  educationLevels: [],
  products: [],
  addresses: [],
  carts: [],
  actionAddtoCart: (product, count = 1, sizeData) => {
    const carts = get().carts;
    
    // หา index ของสินค้าที่มี id และ size เดียวกัน
    const existingItemIndex = carts.findIndex(
      item => item.id === product.id && 
               JSON.stringify(item.sizeData) === JSON.stringify(sizeData)
    );

    let updatedCarts;
    
    if (existingItemIndex !== -1) {
      // ถ้ามีสินค้าและ size เดียวกันอยู่แล้ว ให้เพิ่ม count
      updatedCarts = [...carts];
      updatedCarts[existingItemIndex] = {
        ...updatedCarts[existingItemIndex],
        count: updatedCarts[existingItemIndex].count + count
      };
    } else {
      // ถ้าไม่มี ให้เพิ่มรายการใหม่
      updatedCarts = [...carts, { ...product, count, sizeData }];
    }

    set({ carts: updatedCarts });
    // console.log("add to cart", updatedCarts);
  },

  // อัพเดทจำนวนสินค้าในตะกร้า
  actionUpdateCartItemCount: (productId, sizeData, newCount) => {
    const carts = get().carts;
    const updatedCarts = carts.map(item => {
      if (item.id === productId && JSON.stringify(item.sizeData) === JSON.stringify(sizeData)) {
        return { ...item, count: Math.max(0, newCount) };
      }
      return item;
    }).filter(item => item.count > 0); // ลบรายการที่มี count = 0

    set({ carts: updatedCarts });
    // console.log("update cart item count", updatedCarts);
  },

  // ลบสินค้าออกจากตะกร้า
  actionRemoveFromCart: (productId, sizeData) => {
    const carts = get().carts;
    const updatedCarts = carts.filter(item => 
      !(item.id === productId && JSON.stringify(item.sizeData) === JSON.stringify(sizeData))
    );

    set({ carts: updatedCarts });
    // console.log("remove from cart", updatedCarts);
  },

  // คำนวณราคารวมทั้งหมดในตะกร้า
  getTotalPrice: () => {
    const carts = get().carts;
    return carts.reduce((total, item) => {
      return total + (item.sizeData.price * item.count);
    }, 0);
  },

  // คำนวณราคารวมของสินค้าที่เลือก
  getSelectedTotalPrice: (selectedItems) => {
    const carts = get().carts;
    return carts.reduce((total, item) => {
      const itemKey = `${item.id}-${item.sizeData.size}`;
      if (selectedItems.has(itemKey)) {
        return total + (item.sizeData.price * item.count);
      }
      return total;
    }, 0);
  },

  // นับจำนวนสินค้าทั้งหมดในตะกร้า
  getTotalItems: () => {
    const carts = get().carts;
    return carts.reduce((total, item) => total + item.count, 0);
  },

  // นับจำนวนสินค้าที่เลือก
  getSelectedItemsCount: (selectedItems) => {
    const carts = get().carts;
    return carts.reduce((total, item) => {
      const itemKey = `${item.id}-${item.sizeData.size}`;
      if (selectedItems.has(itemKey)) {
        return total + item.count;
      }
      return total;
    }, 0);
  },

  // ล้างตะกร้าทั้งหมด
  actionClearCart: () => {
    set({ carts: [] });
    // console.log("clear cart");
  },
  actionLogin: async (formData) => {
    const res = await axios.post(`${API_BASE_URL}/api/login`, formData);
    set({ user: res.data.payload, token: res.data.token });
    return res;
  },
  setToken: async (token) => {
    set({ token });
    // ดึง user profile ทันทีเมื่อมี token
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/google/login/success`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ user: res.data.payload });
    } catch (err) {
      console.error("Failed to fetch user:", err);
      set({ user: null, token: null });
    }
  },
  logout: () =>
    set({
      user: null,
      token: null,
      carts: [],
      products: [],
      categories: [],
      educationLevels: [],
      addresses: [],
    }),

  getCategory: async () => {
    try {
      const res = await listCategory();
      set({ categories: res.data });
    } catch (error) {
      console.log(error);
    }
  },
  getEducationLevel: async () => {
    try {
      const res = await listEducationLevels();
      set({ educationLevels: res.data });
    } catch (error) {
      console.log(error);
    }
  },
  getProduct: async (count) => {
    try {
      const res = await listProduct(count);
      set({ products: res.data });
    } catch (error) {
      console.log(error);
    }
  },

  // Address actions
  getAddresses: async () => {
    try {
      const token = get().token;
      const res = await listAddress(token);
      set({ addresses: res.data.addresses || [] });
    } catch (error) {
      console.error("Error fetching addresses:", error);
      set({ addresses: [] });
    }
  },


});

const usePersist = {
  name: "Srisiam-storage", // unique name
  storage: createJSONStorage(() => localStorage),
};

const useSrisiamStore = create(persist(SrisiamStore, usePersist));

export default useSrisiamStore;
