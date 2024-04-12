## ECHINESE - LMS V2

> Framework : next 10.0.0


Clone source code:

```sh
git clone https://github.com/annguyen97dev/LMS-ECHINESE
```

```sh
npm install
```

```sh
npm run dev
```

```markdown
├───apiBase ⇾ chứa các hàm gọi api
│ ├───types ⇾ chứa type của các kết quả api trả ra
│ └───exam ⇾ mẫu hàm gọi api (thay đổi link và type là dùng được)
├───components -> chứa các componets (lưu ý: tất cả các component đều phải export default)
├───context
│ └───wrap ⇾ chứa các dữ liệu có thể gọi ra ở bất cứ đâu
│ ├───userInformation ⇾ thông tin tài khoản đang đăng nhập
│ ├───useAllRoles ⇾ tất cả các role trong hệ thống
│ ├───useStaffRoles ⇾ các role nhân viên
│ ├───showNoti ⇾ hiện ra các thông báo - VD: showNoti("success", "Thành công")
│ └───pageSize ⇾ số row cho các bảng (sài cho đồng bộ)
├───lib ⇾ chứa những thứ lung tung (fake data....)
├───pages ⇾ chứa các page của hệ thống (không lưu components, lib... trong này)
├───public ⇾ file scss global
│ └───images ⇾ chứa các hình ảnh dùng trong hệ thống (logo, default image...)
├───types ⇾ định nghĩa kiểu dữ liệu typescript
└───utils ⇾ các hàm tiện ích

appConfig.ts ⇾ file config dự án
```


```tsx
import { useWrap } from '~/context/wrap';
// ...
const { userInformation } = useWrap();
```

#### Tạo thông báo:

```tsx
import { useWrap } from '~/context/wrap';
//...
const { showNoti } = useWrap();
//...
showNoti('success', 'Ghi âm thành công');
//...
showNoti('danger', 'Thất bại');
```

#### Keyword

-   lms, echinese, monamedia, elearning
