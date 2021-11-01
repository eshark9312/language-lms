import React from 'react';
import { Airplay, FileText, Home, User, UserCheck } from 'react-feather';

export const TeacherParentMenu = [
	{
		TabName: 'tab-home',
		Icon: <Home />
	},
	{
		TabName: 'tab-course',
		Icon: <Airplay />
	},
	{
		TabName: 'tab-package',
		Icon: <FileText />
	},
	{
		TabName: 'tab-student',
		Icon: <User />
	},
	{
		TabName: 'tab-staff',
		Icon: <UserCheck />
	}
];

export const TeacherChildMenu = [
	{
		MenuName: 'tab-home',
		MenuTitle: 'Trang chủ',
		MenuKey: '/dashboard',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/newsfeed',
				Route: '/newsfeed',
				Icon: '',
				Text: 'Tin tức'
			},
			{
				TypeItem: 'single',
				Key: '/course/schedule-study-teacher',
				Icon: '',
				Route: '/course/schedule-study-teacher',
				Text: 'Lịch dạy '
			},
			{
				TypeItem: 'single',
				Key: '/teacher/day-off-schedule',
				Icon: '',
				Route: '/teacher/day-off-schedule',
				Text: 'Lịch nghỉ'
			},
			{
				TypeItem: 'single',
				Key: '/staff/salary-of-teacher',
				Icon: '',
				Route: '/staff/salary-of-teacher',
				Text: 'Bảng lương giáo viên'
			}
		]
	},
	{
		MenuName: 'tab-course',
		MenuTitle: 'Khóa học',
		MenuKey: '/course',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/course/course-buy',
				Icon: '',
				Route: '/course/course-buy',
				Text: 'Danh sách khóa học - mua bán'
			},
			{
				TypeItem: 'single',
				Key: '/course/register-course',
				Icon: '',
				Route: '/course/register-course',
				Text: 'Đăng ký khóa học'
			}
			// {
			//   ItemType: "sub-menu",
			//   Key: "sub-course-zoom",
			//   Icon: "",
			//   TitleSub: "Quản lý Zoom",
			//   SubMenuList: [
			//     {
			//       ItemType: "single",
			//       Key: "/course/manage-zoom/teacher-config-zoom",
			//       Route: "/course/manage-zoom/teacher-config-zoom",
			//       Text: "Cấu hình",
			//       Icon: "",
			//     },
			//     {
			//       ItemType: "single",
			//       Key: "/course/manage-zoom/meeting-zoom",
			//       Route: "/course/manage-zoom/meeting-zoom",
			//       Text: "Danh sách phòng học",
			//       Icon: "",
			//     },
			//     {
			//       ItemType: "single",
			//       Key: "/course/manage-zoom/meeting-internal",
			//       Route: "/course/manage-zoom/meeting-internal",
			//       Text: "Phòng họp nội bộ",
			//       Icon: "",
			//     },
			//   ],
			// },
		]
	},
	{
		MenuName: 'tab-package',
		MenuTitle: 'Bộ đề',
		MenuKey: '/package',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/package/package-result-teacher',
				Route: '/package/package-result-teacher',
				Text: 'Danh sách bài tập',
				Icon: ''
			}
		]
	},
	{
		MenuName: 'tab-student',
		MenuTitle: 'Học viên',
		MenuKey: '/customer',
		MenuItem: [
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-course-child-3',
				Icon: '',
				TitleSub: 'Báo cáo học viên',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/customer/report/report-customer-warning',
						Route: '/customer/report/report-customer-warning',
						Text: 'Cảnh báo học viên',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/customer/report/report-customer-test',
						Route: '/customer/report/report-customer-test',
						Text: 'Học viên sắp thi',
						Icon: ''
					}
				]
			},
			{
				ItemType: 'single',
				Key: '/customer/service/service-info-student',
				Route: '/customer/service/service-info-student',
				Text: 'Thêm lịch hẹn test',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/customer/feedback-list',
				Route: '/customer/feedback-list',
				Text: 'Phản hồi',
				Icon: ''
			},
			{
				TypeItem: 'single',
				Key: '/customer/service/service-test-teacher',
				Route: '/customer/service/service-test-teacher',
				Icon: '',
				Text: 'Chấm bài hẹn test'
			}
		]
	},
	{
		MenuName: 'tab-staff',
		MenuTitle: 'Phân công',
		MenuKey: '/staff',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/staff/manage-task',
				Route: '/staff/manage-task',
				Text: 'Quản lí công việc',
				Icon: ''
			}
		]
	}
];
