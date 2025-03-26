import React, { useState, useEffect } from "react";
import {
  getVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "../services/voucherService";
import styles from "./style.component/VoucherManagement.module.css";

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newVoucher, setNewVoucher] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    maxDiscount: 0,
    minPurchase: 0,
    startDate: "",
    endDate: "",
    usageLimit: 1,
    isActive: true,
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await getVouchers();
      if (response && response.data && Array.isArray(response.data)) {
        const formattedVouchers = response.data.map((voucher) => ({
          ...voucher,
          startDate: new Date(voucher.startDate).toLocaleDateString(),
          endDate: new Date(voucher.endDate).toLocaleDateString(),
        }));
        setVouchers(formattedVouchers);
      } else {
        setVouchers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách voucher:", error);
      setError("Không thể tải danh sách voucher. Vui lòng thử lại sau.");
      setVouchers([]);
      setLoading(false);
    }
  };

  const validateStartDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt thời gian về 0 để so sánh chỉ ngày

    if (selectedDate < today) {
      return "Ngày bắt đầu không được là ngày trong quá khứ!";
    }
    return null;
  };

  const validateEndDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt thời gian về 0 để so sánh chỉ ngày

    if (selectedDate < today) {
      return "Ngày kết thúc không được là ngày trong quá khứ!";
    }
    return null;
  };

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
  
    if (validateStartDate(newVoucher.startDate) || validateEndDate(newVoucher.endDate)) {
      return;
    }
  
    try {
      const response = await createVoucher(newVoucher);
      console.log("Voucher vừa tạo:", response.data); // Kiểm tra voucher trả về từ API
  
      setNewVoucher({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        maxDiscount: 0,
        minPurchase: 0,
        startDate: "",
        endDate: "",
        usageLimit: 1,
        isActive: true,
      });
  
      await fetchVouchers(); // Load lại danh sách
    } catch (error) {
      console.error("Lỗi khi tạo voucher:", error);
      setError("Không thể tạo voucher. Vui lòng thử lại sau.");
    }
  };
  

  const handleUpdateVoucher = async (id, updatedData) => {
    try {
      const response = await updateVoucher(id, updatedData);
      if (response && response.data) {
        setVouchers((prevVouchers) =>
          prevVouchers.map((voucher) =>
            voucher._id === id ? { ...voucher, ...updatedData } : voucher
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật voucher:", error);
    }
  };

  const handleDeleteVoucher = async (id) => {
    try {
      await deleteVoucher(id);
      setVouchers((prevVouchers) =>
        prevVouchers.filter((voucher) => voucher._id !== id)
      );
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.voucherManagement}>
      <h2>QUẢN LÝ KHUYẾN MÃI</h2>
      <form onSubmit={handleCreateVoucher} className={styles.voucherForm}>
        <input
          id="mavoucher"
          type="text"
          value={newVoucher.code}
          onChange={(e) =>
            setNewVoucher({ ...newVoucher, code: e.target.value })
          }
          placeholder="Mã voucher"
          required
        />
        <select
          value={newVoucher.discountType}
          onChange={(e) =>
            setNewVoucher({ ...newVoucher, discountType: e.target.value })
          }
        >
          <option id="ptcd" value="percentage">Phần trăm</option>
          <option id="stcd" value="fixed">Số tiền cố định</option>
        </select>
        <input
          id="gtgg"
          type="number"
          value={newVoucher.discountValue}
          onChange={(e) =>
            setNewVoucher({
              ...newVoucher,
              discountValue: Number(e.target.value),
            })
          }
          placeholder="Giá trị giảm giá"
          required
        />
        <input 
          id="ggtd"
          type="number"
          value={newVoucher.maxDiscount}
          onChange={(e) =>
            setNewVoucher({
              ...newVoucher,
              maxDiscount: Number(e.target.value),
            })
          }
          placeholder="Giảm giá tối đa"
        />
        <input
          id="gtdhtt"
          type="number"
          value={newVoucher.minPurchase}
          onChange={(e) =>
            setNewVoucher({
              ...newVoucher,
              minPurchase: Number(e.target.value),
            })
          }
          placeholder="Giá trị đơn hàng tối thiểu"
          required
        />
        <input
          id="nbd"
          type="date"
          value={newVoucher.startDate}
          onChange={(e) => {
            const date = e.target.value;
            const errorMessage = validateStartDate(date);
            if (errorMessage) {
              alert(errorMessage);
            }
            setNewVoucher({ ...newVoucher, startDate: date });
          }}
          required
        />
        <input
         id="nkt"
          type="date"
          value={newVoucher.endDate}
          onChange={(e) => {
            const date = e.target.value;
            const errorMessage = validateEndDate(date);
            if (errorMessage) {
              alert(errorMessage);
            }
            setNewVoucher({ ...newVoucher, endDate: date });
          }}
          required
        />
        <input
          id="ghsd"
          type="number"
          value={newVoucher.usageLimit}
          onChange={(e) =>
            setNewVoucher({
              ...newVoucher,
              usageLimit: Number(e.target.value),
            })
          }
          placeholder="Giới hạn sử dụng"
          required
        />
        <button id="btnTVC" type="submit">Tạo Voucher</button>
      </form>
      <table className={styles.voucherTable}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Loại giảm giá</th>
            <th>Giá trị</th>
            <th>Giảm giá tối đa</th>
            <th>Đơn hàng tối thiểu</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Đã sử dụng</th>
            <th>Giới hạn sử dụng</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr key={voucher._id}>
              <td>{voucher.code}</td>
              <td>
                {voucher.discountType === "percentage"
                  ? "Phần trăm"
                  : "Cố định"}
              </td>
              <td>{voucher.discountValue}</td>
              <td>{voucher.maxDiscount}</td>
              <td>{voucher.minPurchase}</td>
              <td>{voucher.startDate}</td>
              <td>{voucher.endDate}</td>
              <td>{voucher.usedTimes}</td>
              <td>{voucher.usageLimit}</td>
              <td>{voucher.isActive ? "Hoạt động" : "Không hoạt động"}</td>
              <td > 
                <button id="btnkichhoat" className={styles.actionButton}
                  onClick={() =>
                    handleUpdateVoucher(voucher._id, {
                      isActive: !voucher.isActive,
                    } ) 
                  }
                >
                  {voucher.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                </button>
                <button id="xoaVC" onClick={() => handleDeleteVoucher(voucher._id)} className={styles.deleteBtn}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherManagement;
