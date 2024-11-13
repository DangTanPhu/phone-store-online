import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { getProducts } from '../services/api';

const imageUrl = (img) => {
  if (!img) return '/assets/placeholder-image.jpg';
  if (img.startsWith('http')) return img;
  return `${process.env.REACT_APP_API_URL}/uploads/${img}`;
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await getProducts(); 
      if (response && Array.isArray(response)) {
        const sortedProducts = response.sort((a, b) => b.sales - a.sales);
        setFeaturedProducts(sortedProducts.slice(0, 4));
      } else {
        console.error('Unexpected response format:', response);
        setFeaturedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
    }
  };

  return (
    <div className={styles.homePage}>
      <section className={styles.heroSection}>
        <video autoPlay muted loop className={styles.heroVideo}>
          <source src="https://cdn.alsgp0.fds.api.mi-img.com/e-commerce/N8/pc-new.mp4?GalaxyAccessKeyId=5151729087601&Expires=9223372036854775807&Signature=09awt1AAs3tLYI%2BjuyT2n8i1n%2BM%3D" type="video/mp4" />
        </video>
        <div className={styles.heroOverlay}>
          <h1 className={styles.glitchSlogan}>
            <span className={styles.brand}>PomDu</span>
            <div className={styles.sloganContainer}>
              <span className={styles.sloganText}>Ôm Trọn Bản Sắc</span>
              <span className={styles.sloganText}>Phong Cách Hiện Đại</span>
            </div>
          </h1>
          <Link to="/products" className={styles.ctaButton}>Mua Ngay</Link>
        </div>
      </section>

      {/* <section className={styles.categoriesGrid}>
        <div className={`${styles.categoryItem} ${styles.large}`}>
          <img src="/assets/1_MENS-BIGWIG.jpg" alt="Bộ Sưu Tập Nam" />
          <div className={styles.categoryOverlay}>
            <h2>Bộ Sưu Tập Nam</h2>
            <Link to="/category/men" className={styles.categoryLink}>Khám Phá</Link>
          </div>
        </div>
        <div className={`${styles.categoryItem} ${styles.medium}`}>
          <img src="/assets/women.jpg" alt="Bộ Sưu Tập Nữ" />
          <div className={styles.categoryOverlay}>
            <h2>Bộ Sưu Tập Nữ</h2>
            <Link to="/category/women" className={styles.categoryLink}>Khám Phá</Link>
          </div>
        </div>
        <div className={`${styles.categoryItem} ${styles.small}`}>
          <img src="/assets/3_PRINTABLES.jpg" alt="Áo Thun Họa Tiết" />
          <div className={styles.categoryOverlay}>
            <h2>Áo Thun Họa Tiết</h2>
            <Link to="/category/graphic-tees" className={styles.categoryLink}>Khám Phá</Link>
          </div>
        </div>
        <div className={`${styles.categoryItem} ${styles.small}`}>
          <img src="/assets/4_SHEPARD_COLLECTION.jpg" alt="Bộ Sưu Tập Shepard Fairey" />
          <div className={styles.categoryOverlay}>
            <h2>Bộ Sưu Tập Shepard Fairey</h2>
            <Link to="/category/shepard-fairey" className={styles.categoryLink}>Khám Phá</Link>
          </div>
        </div>
      </section> */}

      <section className={styles.featuredProducts}>
        <h2>Sản phẩm nổi bật</h2>
        <div className={styles.productGrid}>
          {featuredProducts.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.imageContainer}>
                <img 
                  src={imageUrl(product.image)} 
                  alt={product.name} 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/assets/placeholder-image.jpg';
                  }}
                />
              </div>
              <h3>{product.name}</h3>
              <p>{product.price.toLocaleString('vi-VN')} đ</p>
              <Link to={`/product/${product.slug}`} className={styles.shopButton}>MUA NGAY</Link>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.aboutUs}>
        <h2>Một câu chuyện hài hước</h2>
        <div className={styles.storyContent}>
          <div className={styles.storyText}>
            <p>PomDu khởi nguồn là một thương hiệu bán điện thoại nổi tiếng, được thành lập với sứ mệnh mang đến cho người tiêu dùng những sản phẩm công nghệ chất lượng cao và dịch vụ chăm sóc khách hàng tận tâm. 
              Ban đầu, PomDu tập trung vào phân phối các dòng điện thoại thông minh của các hãng uy tín, nhằm đáp ứng nhu cầu ngày càng tăng về thiết bị di động trong đời sống hiện đại. Với mục tiêu xây dựng niềm tin và sự hài lòng của khách hàng,
              PomDu không chỉ chú trọng đến việc lựa chọn sản phẩm uy tín, mà còn phát triển dịch vụ hậu mãi vượt trội, bao gồm bảo hành, sửa chữa và hỗ trợ kỹ thuật tận tình. Đến nay, 
              PomDu đã mở rộng thành chuỗi cửa hàng bán lẻ và kênh mua sắm trực tuyến, giúp khách hàng dễ dàng tiếp cận các sản phẩm mới nhất và chất lượng hàng đầu trên thị trường.</p>
            <Link to="/about" className={styles.learnMoreButton}>Tìm hiểu thêm</Link>
          </div>
          <div className={styles.storyImage}>
            <img src="https://pm1.narvii.com/6389/9179ede0bbbf6bd449453ffe8dc2a763e7ac2ff5_hq.jpg"  />
          </div>
        </div>
      </section>

      <section className={styles.obeyLookbook}>
        <h2>Bộ Sưu Tập PomDu</h2>
        <div className={styles.lookbookGrid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className={styles.lookbookItem}>
              <img src={`/assets/lookbook-${item}.jpg`} alt={`Hình ảnh bộ sưu tập ${item}`} />
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          <Link to="/lookbook" className={styles.viewLookbookButton}>Xem Toàn Bộ Bộ Sưu Tập</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;