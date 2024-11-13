import React from "react";
import styles from "./AboutPage.module.css";

const AboutPage = () => {
  return (
    <div className={styles.aboutContainer}>
      <section className={styles.heroSection}>
        <h1>Lịch sử PomDu</h1>
        <div className={styles.heroImage}>
          <img
            src="https://mega.com.vn/media/news/2707_anh-nen-lich-su-dep-lam-slide2.jpg"
            alt="PomDu Brand Story"
            width="100%"
          />
        </div>
      </section>
      <section className={styles.brandStory}>
        <div className={styles.storyContent}>
          <h2>Lịch sử hình thành</h2>
          <p>
            PomDu được thành lập từ 5 thành viên đến từ các tỉnh thành khác
            nhau, được thành lập với sứ mệnh mang đến cho người tiêu dùng những
            sản phẩm công nghệ chất lượng cao và dịch vụ chăm sóc khách hàng tận
            tâm. PomDu tập trung vào phân phối các dòng điện thoại thông minh
            của các hãng uy tín, nhằm đáp ứng nhu cầu ngày càng tăng về thiết bị
            di động trong đời sống hiện đại
          </p>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <h2>Giá trị cốt lỗi</h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <h3>Thiết kế</h3>
            <p>
              Thiết kế điện thoại hiện đại không chỉ tập trung vào hình thức bên
              ngoài mà còn chú trọng đến trải nghiệm người dùng, tính năng, và
              sự tiện lợi. Các yếu tố như chất liệu cao cấp, màn hình không
              viền, camera đa chức năng, và thiết kế thân thiện với người sử
              dụng đã tạo ra những sản phẩm có thể đáp ứng mọi nhu cầu từ công
              việc, giải trí đến tính thẩm mỹ.
            </p>
          </div>
          <div className={styles.valueCard}>
            <h3>Công nghệ</h3>
            <p>
              Công nghệ điện thoại ngày nay không chỉ bao gồm các tính năng cơ
              bản như màn hình, camera, và vi xử lý, mà còn bao gồm các công
              nghệ tiên tiến như 5G, AI, AR, và các cải tiến về bảo mật, pin và
              sạc. Những đổi mới này đang thay đổi cách chúng ta sử dụng điện
              thoại và làm cho chúng trở thành công cụ ngày càng mạnh mẽ hơn
              trong cuộc sống hàng ngày.
            </p>
          </div>
          <div className={styles.valueCard}>
            <h3>Nhu cầu</h3>
            <p>
              Nhu cầu của người dùng đối với điện thoại hiện nay rất đa dạng và
              không ngừng thay đổi, từ các yếu tố cơ bản như hiệu suất và thời
              gian sử dụng, đến các nhu cầu tinh tế hơn như bảo mật, thiết kế,
              và tính bền vững. Với sự phát triển nhanh chóng của công nghệ,
              người tiêu dùng có xu hướng tìm kiếm những chiếc điện thoại có khả
              năng đáp ứng nhiều yêu cầu khác nhau, từ công việc, giải trí, đến
              bảo vệ quyền riêng tư và sự bền vững với môi trường.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.timelineSection}>
        <h2>Lịch sử hình thành</h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <h3>Tháng 8 - 2024</h3>
            <p>5 thành viên gặp gỡ nhau và làm quen</p>
          </div>
          <div className={styles.timelineItem}>
            <h3>Tháng 9 - 2024</h3>
            <p>5 thành viên đã cùng nhau hợp tác phát triển 1 công ty</p>
          </div>
          <div className={styles.timelineItem}>
            <h3>Tháng 10 - 2024</h3>
            <p>PomDu Mobile chính thức ra mắt</p>
          </div>
          <div className={styles.timelineItem}>
            <h3>Hiện Tại</h3>
            <p>Phát triển thành cửa hàng bán điện thoại top 1 Việt Nam</p>
          </div>
        </div>
      </section>

      <section className={styles.brandStory}>
        <div className={styles.storyContent}>
          <h2>Tầm nhìn của chúng tôi</h2>
          <p>
            Trong thời đại Cách mạng công nghiệp 4.0, khi công nghệ và Internet
            đang thay đổi sâu sắc mọi mặt của đời sống, việc có một cửa hàng bán
            điện thoại online không chỉ là một xu hướng mà còn là một yêu cầu
            tất yếu đối với các doanh nghiệp muốn duy trì sự cạnh tranh và phát
            triển bền vững.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
