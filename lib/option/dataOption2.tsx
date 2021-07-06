export const data = [];

for (let i = 1; i < 99; i++) {
	data.push({
		key: i + 1,
		code: `5Y48ROAEJ${i + 1}`,
		price: `${i + 1},000,000`,
		typeSalary: `${
			i % 2 === 0 ? 'Tính lương theo tháng' : 'Tính lương theo giờ'
		}`,
		percent: `${i + 1}%`,
		status: 'Đang sử dụng',
		quantity: `${i + 1}`,
		quantityLeft: `${i + 1}`,
		note: `Ghi chú ${i + 1}`,
		expires: `0${(i % 10) + 1}/05/2021`,
		srcStatus: i + 1,
		source: `https://zim${i + 1}.vn/`,
		modBy: `admin ${i + 1}`,
		modDate: `${i % 10}/05/2021 1${(i % 10) + 1}:05`,
		noteDayOff: `Nghỉ lễ ${i}`,
		dayOff: `0${i % 10}/05/2021`,
		job: `Job ${i}`,
		services: `Đăng ký thi thử IELTS ${i}`,
		role: `Student ${i}`,
		supplier: `British Council ${i}`,
		purpose: `Mục đích học tập ${i}`,
		staff: `Nhân viên ${i}`,
		userNameStaff: `nhanvien${i}`,
		email: `abc${i}@gmail.com`,
		staffRole: 'TVV',
		teacher: `Giáo viên ${i}`,
		center: `MONA - ${i} Lý Thường Kiệt`,
		exam: `Thi Thử`,
		slot: `${(i % 10) + 1 * 10}`,
		hour: `0${(i % 10) - 1}:00`,
		title: `Tiêu đề ${i}`,
		postStatus: i + 1,
		idiom: `Ta đã ở bên nhau. Những năm tháng nhọc nhằn. You make me feel like....I got everything. Dù mai có ra sao. Ta vẫn sẽ tự hào. Vì đã luôn bên nhau. We do everything. Đưa tay đây nào. Mãi bên nhau bạn nhớ`,
		fbType: `Hỗ trợ học viên`,
		fbReason: `Xin nghỉ buổi học`,
	});
}
