import React, { useState, useEffect, useCallback } from "react";
import { getCategories, createCategory, deleteCategory, updateCategory } from "../services/api";
import styles from "./style.component/CategoryManagement.module.css";
import { toast } from "react-toastify";
const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", parentId: "" });
  const [editCategory, setEditCategory] = useState(null); // State lưu danh mục đang chỉnh sửa
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searched, setSearched] = useState(false);
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      setError("Không thể tải danh sách danh mục. Vui lòng thử lại sau.");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editCategory) {
      setEditCategory((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (newCategory.name.length < 2 || newCategory.name.length > 50) {
      window.alert("Tên danh mục phải từ 2 đến 50 ký tự!");
      return;
    }
    if (newCategory.slug.length < 2 || newCategory.slug.length > 100) {
      window.alert("Slug phải từ 2 đến 100 ký tự!");
      return;
    }
    try {
      const response = await createCategory(newCategory);
      setCategories((prevCategories) => [...prevCategories, response]);
      setNewCategory({ name: "", slug: "", parentId: "" });
      window.alert("Danh mục đã được tạo thành công!");
      setError("");
      fetchCategories();
    } catch (error) {
      setError(error.response?.data?.message || "Lỗi khi tạo danh mục");
      setSuccess("");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await deleteCategory(categoryId);
        window.alert("Danh mục đã được xóa thành công!");
        setError("");
        fetchCategories();
      } catch (error) {
        setError(error.response?.data?.message || "Có lỗi xảy ra khi xóa danh mục");
        setSuccess("");
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategory) return;
  
    // Kiểm tra ràng buộc trước khi gửi yêu cầu
    if (editCategory.name.length < 2 || editCategory.name.length > 50) {
      window.alert("Tên danh mục phải từ 3 đến 50 ký tự!");
      return;
    }
    if (editCategory.slug.length < 2 || editCategory.slug.length > 100) {
      window.alert("Slug phải từ 3 đến 100 ký tự!");
      return;
    }
  
    try {
      await updateCategory(editCategory._id, editCategory);
      window.alert("Danh mục đã được cập nhật thành công!");
      setEditCategory(null);
      fetchCategories();
    } catch (error) {
      window.alert(error.response?.data?.message || "Lỗi khi cập nhật danh mục");
    }
  };
  

  const renderCategories = (categories, level = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category._id}>
        <div className={styles.categoryItem} style={{ marginLeft: `${level * 20}px` }}>
          <span className={styles.categoryName}>
            {category.name} - {category.slug}
          </span>
          <button id={`chinhsuaDM-${category._id}`}  className={styles.editButton} onClick={() => handleEditCategory(category)}>
            Chỉnh sửa
          </button>
          
          <button
                  id={`xoaDM-${category._id}`}
  className={styles.deleteButton}
  onClick={() => handleDeleteCategory(category._id)}
>
  Xóa
</button>
        </div>
        {category.children && category.children.length > 0 && renderCategories(category.children, level + 1)}
      </React.Fragment>
    ));
  };
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  const handleSearch = () => {
    const result = categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    setFilteredCategories(result);
    setSearched(true);
  
    if (result.length > 0) {
      toast.success('Đã tìm thấy danh mục!', { toastId: 'search-toast' });
    } else {
      toast.error('Không tìm thấy danh mục nào!', { toastId: 'search-toast' });
    }
  };

  useEffect(() => {
    if (!searched) {
      setFilteredCategories(categories);
    }
  }, [categories, searched]);
  return (
    <div className={styles.categoryManagement}>
      <h2>QUẢN LÝ DANH MỤC</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <div className={styles.searchContainer}>
        <input
          id="timkiemtl"
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          
        />
        <button onClick={handleSearch} id="buttontk" className={styles.searchButton}>Tìm kiếm</button>
      </div>

      {/* Form tạo danh mục */}
      <form onSubmit={handleCreateCategory} className={styles.form}>
        <input id="nhapDM" type="text" name="name" value={newCategory.name} onChange={handleInputChange} placeholder="Tên danh mục" required className={styles.input} />
        <input id="nhapslug" type="text" name="slug" value={newCategory.slug} onChange={handleInputChange} placeholder="Slug" required className={styles.input} />
        <select id="chonDM" name="parentId" value={newCategory.parentId} onChange={handleInputChange} className={styles.select}>
          <option value="">Không có danh mục cha</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <button id="btnTDM" type="submit" className={styles.button}>Tạo danh mục</button>
      </form>

      {/* Form cập nhật danh mục */}
      {editCategory && (
        <form onSubmit={handleUpdateCategory} className={styles.form}>
          <h3>Chỉnh sửa danh mục</h3>
          <input id="nhapDMM" type="text" name="name" value={editCategory.name} onChange={handleInputChange} required className={styles.input} />
          <input id="nhapslugM" type="text" name="slug" value={editCategory.slug} onChange={handleInputChange} required className={styles.input} />
          <select id="chonDMM" name="parentId" value={editCategory.parentId || ""} onChange={handleInputChange} className={styles.select}>
            <option  value="">Không có danh mục cha</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id} >
                {category.name}
              </option>
            ))}   
          </select>
          <button id="capnhatDM" type="submit" className={styles.button}>Cập nhật</button>
          <button id="huyDM" type="button" className={styles.cancelButton} onClick={() => setEditCategory(null)}>
            Hủy 
          </button>
        </form>
      )}

      <div className={styles.categoryListContainer}>
        <h3>Danh sách danh mục:</h3>
        {renderCategories(filteredCategories)}
      </div>
    </div>
  );
};

export default CategoryManagement;
