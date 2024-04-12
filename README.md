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
