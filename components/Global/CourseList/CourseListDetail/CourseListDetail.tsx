import {Spin, Tabs} from 'antd';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';
import {
	Activity,
	Bell,
	Book,
	Calendar,
	CheckCircle,
	Edit,
	FileText,
	Flag,
} from 'react-feather';
import DocumentCourse from '~/components/Global/CourseList/CourseListDetail/Document/DocumentCourse';
import RollUp from '~/components/Global/CourseList/CourseListDetail/RollUp/RollUp';
import StudentsList from '~/components/Global/CourseList/CourseListDetail/StudentList/StudentList';
import Comment from './Comment/Comment';
import CourseDetailCalendar from './CourseDetailCalendar/CourseDetailCalendar';
import NotificationCourse from './NotificationCourse/NotificationCourse';
import Transcript from './Transcript/Transcript';

const {TabPane} = Tabs;
const CourseListDetail = () => {
	const router = useRouter();
	const {slug: ID, type} = router.query;
	const parseIntID = parseInt(ID as string);
	return (
		<div className="course-dt page-no-scroll">
			<Tabs tabPosition="right">
				<TabPane
					tab={
						<>
							<Calendar />
							<span title="Lịch học"> Lịch học</span>
						</>
					}
					key="1"
				>
					<CourseDetailCalendar courseID={parseIntID} />
				</TabPane>
				<TabPane
					tab={
						<Link
							href={{
								pathname:
									parseInt(type as string) === 1
										? '/course/course-list/edit-course/[slug]'
										: '/course/course-list/edit-course-online/[slug]',
								query: {slug: parseIntID},
							}}
						>
							<a>
								<Edit />
								<span title="Chỉnh sửa"> Chỉnh sửa</span>
							</a>
						</Link>
					}
					key="2"
				>
					<div
						className="d-flex align-items-center justify-content-center"
						style={{height: 200}}
					>
						<Spin size="large" />
					</div>
				</TabPane>
				<TabPane
					tab={
						<>
							<Book />
							<span title="Học viên"> Học viên</span>
						</>
					}
					key="3"
				>
					<StudentsList courseID={parseIntID} />
				</TabPane>
				<TabPane
					tab={
						<>
							<CheckCircle />
							<span title="Điểm danh"> Điểm danh</span>
						</>
					}
					key="4"
				>
					<RollUp courseID={parseIntID} />
				</TabPane>
				<TabPane
					tab={
						<>
							<Activity />
							<span title="Nhập điểm"> Nhập điểm</span>
						</>
					}
					key="5"
				>
					<Transcript />
				</TabPane>
				<TabPane
					tab={
						<>
							<FileText />
							<span title="Tài liệu"> Tài liệu</span>
						</>
					}
					key="6"
				>
					<DocumentCourse courseID={parseIntID} />
				</TabPane>
				<TabPane
					tab={
						<>
							<Flag />
							<span title="Phản hồi"> Phản hồi</span>
						</>
					}
					key="7"
				>
					<Comment courseID={parseIntID} />
				</TabPane>
				<TabPane
					tab={
						<>
							<Bell />
							<span title="Thông báo"> Thông báo</span>
						</>
					}
					key="8"
				>
					<NotificationCourse courseID={parseIntID} />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default CourseListDetail;
