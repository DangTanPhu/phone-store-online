import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, getCategories } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import styles from "./style.component/CreateProduct.module.css";
import { SIZE_GUIDES } from "../constants/sizeGuides";

const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    subcategoryId: "",
    stock: "",
    sizes: "",
    colors: "",
    sizeGuideType: "",
  });

  const [image, setImage] = useState(null);
  const [detailImages, setDetailImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        console.log("Fetched categories:", response);
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Không thể tải danh sách danh mục");
      }
    };

    fetchCategories();
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    console.log("Changing product:", name, value);
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleDetailImagesChange = (e) => {
    setDetailImages(Array.from(e.target.files));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      formData.append(key, product[key]);
    });

    if (image) {
      formData.append("image", image);
    }

    detailImages.forEach((img) => {
      formData.append("detailImages", img);
    });

    try {
      const response = await createProduct(formData);
      console.log("Product created:", response);
      navigate("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      setError(error.response?.data?.message || "Có lỗi xảy ra khi tạo sản phẩm");
    }
  };

  const renderCategories = (categories, level = 0) => {
    return categories.flatMap((category) => [
      <option
        key={category._id}
        value={category._id}
        disabled={category.children && category.children.length > 0}
        style={{ paddingLeft: `${level * 20}px` }}
      >
        {"-".repeat(level)} {category.name}
      </option>,
      ...(category.children ? renderCategories(category.children, level + 1) : []),
    ]);
  };

  if (!user || user.role !== "admin") {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }

  return (
    <div className={styles.createProduct}>
      <h2>TẠO SẢN PHẨM MỚI</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleProductSubmit}>
        <input
          id="cp"
          type="text"
          name="name"
          placeholder="Tên sản phẩm"
          value={product.name}
          onChange={handleProductChange}
          required
        />
        <textarea
          id="mt"
          name="description"
          placeholder="Mô tả"
          value={product.description}
          onChange={handleProductChange}
          required
        />
        <input
          id="gia"
          type="number"
          name="price"
          placeholder="Giá"
          value={product.price}
          onChange={handleProductChange}
          required
          min="0"
          step="0.01"
        />
        
        {/* Chọn danh mục cha */}
        <select
          id="chontl"
          name="categoryId"
          value={product.categoryId}
          onChange={handleProductChange}
          required
        >
          <option value="">Chọn danh mục</option>
          {renderCategories(categories)}
        </select>

        {/* Chọn danh mục con */}
        <select
          id="chon-danh-muc-phu"
          name="subcategoryId"
          value={product.subcategoryId}
          onChange={handleProductChange}
          required
        >
          <option value="">Chọn danh mục con</option>
          {categories
            .filter((category) => category.parentId === product.categoryId)
            .map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
        </select>

        <input
          id="slk"
          type="number"
          name="stock"
          placeholder="Số lượng trong kho"
          value={product.stock}
          onChange={handleProductChange}
          required
          min="0"
        />
        <input
          id="kt"
          type="text"
          name="sizes"
          placeholder="Kích thước (cách nhau bằng dấu phẩy)"
          value={product.sizes}
          onChange={handleProductChange}
          required
        />
        <input
          id="mau"
          type="text"
          name="colors"
          placeholder="Màu sắc (cách nhau bằng dấu phẩy)"
          value={product.colors}
          onChange={handleProductChange}
          required
        />
        <input
          id="file1"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          required
        />
        <input
          id="file2"
          type="file"
          multiple
          onChange={handleDetailImagesChange}
          accept="image/*"
        />
        
        <div className={styles.formGroup}>
          <label>Kiểu:</label>
          <select
            id="kieu"
            name="sizeGuideType"
            value={product.sizeGuideType}
            onChange={handleProductChange}
            required
          >
            <option value="">Chọn</option>
            {Object.entries(SIZE_GUIDES).map(([key, guide]) => (
              <option key={key} value={key}>
                {guide.name}
              </option>
            ))}
          </select>

          {product.sizeGuideType && (
            <div className={styles.sizeGuidePreview}>
              <img
                src={SIZE_GUIDES[product.sizeGuideType].image}
                alt={SIZE_GUIDES[product.sizeGuideType].name}
              />
            </div>
          )}
        </div>
        <button id="btntao" type="submit">Tạo sản phẩm</button>
      </form>
    </div>
  );
};

export default CreateProduct;
