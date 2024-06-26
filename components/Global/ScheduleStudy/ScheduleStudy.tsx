import { Card, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
	branchApi,
	checkBranchScheduleStudy,
	checkTeacherScheduleStudy,
	courseDetailApi,
	roomApi,
	studyTimeApi,
	teacherApi
} from '~/apiBase';
import TitlePage from '~/components/TitlePage';
import { useWrap } from '~/context/wrap';
import { fmSelectArr } from '~/utils/functions';
import CDCalendar from '../CourseList/CourseListDetail/CourseDetailCalendar/Calendar';
import CheckBranch from './Form/CheckBranch';
import CheckOneTeacher from './Form/CheckOneTeacher';
import CheckRoom from './Form/CheckRoom';
import CheckManyEmptyTeacher from './Form/ManyTeacher';
import ScheduleStudyList from './List/List';

type IOptionList = {
	branchList: IOptionCommon[];
	studyTimeList: IOptionCommon[];
	roomList: IOptionCommon[];
	teacherList: IOptionCommon[];
};
type IDataList = {
	list: ICourseDetailSchedule[];
	type: string;
};
type infoSearch = {
	title: string;
	branchName?: string;
	roomName?: string;
	teacherName?: string;
	studyTimeName?: string;
	fromDate: string;
	toDate: string;
};
const ScheduleStudy = () => {
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [optionList, setOptionList] = useState<IOptionList>({
		branchList: [],
		studyTimeList: [],
		roomList: [],
		teacherList: []
	});
	const [dataList, setDataList] = useState<IDataList>({
		list: [],
		type: ''
	});
	const [infoSearch, setInfoSearch] = useState<infoSearch>(null);
	const fetchData = async () => {
		setIsLoading({
			type: 'FETCH_DATA',
			status: true
		});
		try {
			Promise.all([branchApi.getAll({ pageSize: 99999, pageIndex: 1 }), studyTimeApi.getAll({ selectAll: true })]).then((res) => {
				const [branchList, studyTimeList] = res.map((r) => (r.status === 200 ? r.data.data : []));
				if (branchList.length) {
					setOptionList((preState) => ({
						...preState,
						branchList: fmSelectArr(branchList, 'BranchName', 'ID')
					}));
				}
				if (studyTimeList.length) {
					setOptionList((preState) => ({
						...preState,
						studyTimeList: fmSelectArr(studyTimeList, 'Name', 'ID')
					}));
				}
			});
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_DATA',
				status: false
			});
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

	const fetchRoomByBranchID = async (ID: number) => {
		setIsLoading({
			type: 'FETCH_ROOM',
			status: true
		});
		try {
			const res = await roomApi.getAll({ BranchID: ID, pageSize: 99999 });
			if (res.status === 200) {
				const fmRoomList = fmSelectArr(res.data.data, 'RoomName', 'RoomID');
				setOptionList({
					...optionList,
					roomList: fmRoomList
				});
			}
			if (res.status === 204) {
				setOptionList({
					...optionList,
					roomList: []
				});
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_ROOM',
				status: false
			});
		}
	};
	const fetchTeacherByBranchID = async (ID: number) => {
		setIsLoading({
			type: 'FETCH_TEACHER',
			status: true
		});
		try {
			const res = await teacherApi.getAll({ BranchID: ID, pageSize: 99999 });
			if (res.status === 200) {
				const fmTeacherList = fmSelectArr(res.data.data, 'FullNameUnicode', 'UserInformationID');
				setOptionList({
					...optionList,
					teacherList: fmTeacherList
				});
			}
			if (res.status === 204) {
				setOptionList({
					...optionList,
					teacherList: []
				});
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_TEACHER',
				status: false
			});
		}
	};

	// Room
	const onCheckRoom = async (value: { BranchID: number; RoomID: number; StartTime: string; EndTime: string }) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res;
		try {
			const { RoomID, StartTime, EndTime, BranchID } = value;
			const fmObj = {
				RoomID,
				StartTime: moment(StartTime).format('YYYY/MM/DD'),
				EndTime: moment(EndTime).format('YYYY/MM/DD')
			};
			res = await courseDetailApi.getAll(fmObj);
			if (res.status === 200) {
				setInfoSearch({
					title: 'Kiểm tra phòng',
					branchName: optionList.branchList.find((b) => b.value === BranchID)?.title || '',
					roomName: optionList.roomList.find((b) => b.value === RoomID)?.title || '',
					fromDate: moment(StartTime).format('DD/MM/YYYY'),
					toDate: moment(EndTime).format('DD/MM/YYYY')
				});
				setDataList({ list: res.data.data, type: '' });
				showNoti('success', res.data.message);
			}
			if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
		return res;
	};
	// OneTeacher
	type IGetTeacher = {
		BranchID: number;
		TeacherID: number | Array<number>;
		StudyTimeID: Array<number>;
		StartTime: string;
		EndTime: string;
	};
	const onCheckOneTeacher = async (value: IGetTeacher) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res;
		try {
			const { TeacherID, StartTime, EndTime, BranchID } = value;
			const fmObj = {
				TeacherID: +TeacherID.toString(),
				StartTime: moment(StartTime).format('YYYY/MM/DD'),
				EndTime: moment(EndTime).format('YYYY/MM/DD')
			};
			res = await courseDetailApi.getAll(fmObj);
			if (res.status === 200) {
				setInfoSearch({
					title: 'Lịch giáo viên',
					teacherName: optionList.teacherList.find((b) => b.value === TeacherID)?.title || '',
					branchName: optionList.branchList.find((b) => b.value === BranchID)?.title || '',
					fromDate: moment(StartTime).format('DD/MM/YYYY'),
					toDate: moment(EndTime).format('DD/MM/YYYY')
				});
				setDataList({ list: res.data.data, type: '' });
				showNoti('success', res.data.message);
			}
			if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
		return res;
	};
	// CALENDAR FORMAT
	const calendarFm = (calendarArr: ICourseDetailSchedule[]) => {
		const rs = calendarArr.map((c, idx) => {
			const { ID, CourseID, CourseName, RoomName, BranchName, TeacherName, SubjectName, StartTime, EndTime, LinkDocument } = c;
			const studyTimeStart = moment(StartTime).format('HH:mm');
			const studyTimeEnd = moment(EndTime).format('HH:mm');
			const studyTime = `${studyTimeStart} - ${studyTimeEnd}`;

			return {
				id: +ID,
				title: '',
				start: moment(StartTime).toDate(),
				end: moment(EndTime).toDate(),
				resource: {
					ID,
					CourseID,
					CourseName,
					RoomName,
					BranchName,
					TeacherName,
					SubjectName,
					LinkDocument,
					//
					StudyTimeName: studyTime
				}
			};
		});
		return rs;
	};

	// OTHER VIEW
	// ManyTeacher
	const onCheckEmptyManyTeacher = async (value: IGetTeacher) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res;
		try {
			const { TeacherID, StudyTimeID, StartTime, EndTime, BranchID } = value;
			const fmObj = {
				TeacherID: TeacherID.toString(),
				StudyTimeID: StudyTimeID.join(','),
				StartTime: moment(StartTime).format('YYYY/MM/DD'),
				EndTime: moment(EndTime).format('YYYY/MM/DD')
			};
			res = await checkTeacherScheduleStudy.getAll(fmObj);
			if (res.status === 200) {
				setDataList({ list: res.data.data, type: 'CheckManyTeacher' });
				setInfoSearch({
					title: 'Lịch nhiều giáo viên',
					branchName: optionList.branchList.find((b) => b.value === BranchID)?.title || '',
					fromDate: moment(StartTime).format('DD/MM/YYYY'),
					toDate: moment(EndTime).format('DD/MM/YYYY')
				});
				showNoti('success', res.data.message);
			}
			if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
		return res;
	};
	const fmListOfEmptyTeacher = (calendarArr: ICheckTeacherScheduleStudy[]) => {
		// rs = {
		//     "2021/08/11": {
		//         "21-Ca 08:00 - 10:00": [
		//             {
		//                 "TeacherID": 1236,
		//                 "TeacherName": "Kim Bảo 98",
		//                 "StudyTimeID": 21,
		//                 "StudyTimeName": "Ca 08:00 - 10:00",
		//                 "Date": "2021-08-11T00:00:00",
		//                 "StartTime": "2021-08-11T08:00:00",
		//                 "EndTime": "2021-08-11T10:00:00"
		//             },
		//         ],
		//     }
		// }
		const rs = {};
		const newCalendarArr = [...calendarArr];
		for (let i = 0; i < newCalendarArr.length; i++) {
			const c = newCalendarArr[i];
			const { Date, StudyTimeID, StudyTimeName, StartTime } = c;
			const fmDateTimeStamp = moment(StartTime).format('X');
			const fmDate = moment(Date).format('YYYY/MM/DD');
			const fmStudyTime = `${StudyTimeID}-${StudyTimeName}-${fmDateTimeStamp}`;
			if (rs[fmDate]) {
				if (rs[fmDate][fmStudyTime]) {
					rs[fmDate][fmStudyTime].push(c);
				} else {
					rs[fmDate][fmStudyTime] = [c];
				}
			} else {
				rs[fmDate] = {};
				newCalendarArr.push(c);
			}
		}
		return rs;
	};

	// ============================================================================
	// ============================================================================
	// ============================================================================
	// ============================================================================
	// ============================================================================
	// ============================================================================

	//Branch
	const onCheckScheduleOfBranch = async (value: { BranchID: number; StartTime: string; EndTime: string }) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res;
		try {
			const { BranchID, StartTime, EndTime } = value;
			const fmObj = {
				branchId: BranchID,
				from: moment(StartTime).format('YYYY/MM/DD'),
				to: moment(EndTime).format('YYYY/MM/DD')
			};
			res = await checkBranchScheduleStudy.getAll(fmObj);
			if (res.status === 200) {
				setDataList({ list: res.data.data, type: 'CheckBranch' });
				setInfoSearch({
					title: 'Lịch trung tâm',
					branchName: optionList.branchList.find((b) => b.value === BranchID)?.title || '',
					fromDate: moment(StartTime).format('DD/MM/YYYY'),
					toDate: moment(EndTime).format('DD/MM/YYYY')
				});
				showNoti('success', res.data.message);
			}
			if (res.status === 204) {
				showNoti('danger', 'Lịch trống');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
		return res;
	};
	useEffect(() => {
		if (optionList.branchList.length) {
			onCheckScheduleOfBranch({
				BranchID: parseInt(optionList.branchList[0].value.toString()),
				StartTime: moment().format('YYYY/MM/DD'),
				EndTime: moment().add(1, 'months').format('YYYY/MM/DD')
			});
		}
	}, [optionList.branchList]);
	const fmListOfBranch = (calendarArr: ICheckBranchScheduleStudyData[]) => {
		// rs = {
		// 		'2021/08/13': {
		// 			'31-Phòng 1-31': [
		// 				{
		// 					RoomID: 31,
		// 					RoomName: 'Phòng 1',
		// 					StudyTimeID: 21,
		// 					StudyTimeName: 'Ca 08:00 - 10:00',
		// 					StartTime: '2021-08-13T08:00:00',
		// 					EndTime: '2021-08-13T10:00:00',
		// 				},
		// 			],
		// 			'32-Phòng 2-32': [
		// 				{
		// 					RoomID: 32,
		// 					RoomName: 'Phòng 2',
		// 					StudyTimeID: 27,
		// 					StudyTimeName: 'Ca 14:00 - 16:00',
		// 					StartTime: '2021-08-13T14:00:00',
		// 					EndTime: '2021-08-13T16:00:00',
		// 				},
		// 			],
		// 		},
		// 	};
		const rs = {};
		const newCalendarArr = [...calendarArr];
		for (let i = 0; i < newCalendarArr.length; i++) {
			const c = newCalendarArr[i];
			const { StartTime, StudyTimeID, RoomName, RoomID, StudyTimeName } = c;
			const fmDate = moment(StartTime).format('YYYY/MM/DD');
			const fmRoomName = `${RoomID}-${RoomName}-${RoomID}`;
			if (rs[fmDate]) {
				if (rs[fmDate][fmRoomName]) {
					rs[fmDate][fmRoomName].push(c);
				} else {
					rs[fmDate][fmRoomName] = [c];
				}
			} else {
				rs[fmDate] = {};
				newCalendarArr.push(c);
			}
		}
		return rs;
	};

	const fmList = (type, arr) => {
		switch (type) {
			case 'CheckBranch':
				return fmListOfBranch(arr);
			case 'CheckManyTeacher':
				return fmListOfEmptyTeacher(arr);
			default:
				break;
		}
	};
	return (
		<div className="row">
			<TitlePage title="Kiểm tra lịch học" />
			<div className="col-12">
				<Card
					extra={
						<div className="card-list-btn">
							<CheckBranch isLoading={isLoading} optionList={optionList} handleSubmit={onCheckScheduleOfBranch} />
							{/* */}
							{/* <CheckRoom
								isLoading={isLoading}
								optionList={optionList}
								handleFetchRoom={fetchRoomByBranchID}
								handleSubmit={onCheckRoom}
							/> */}
							<CheckOneTeacher
								isLoading={isLoading}
								optionList={optionList}
								handleFetchTeacher={fetchTeacherByBranchID}
								handleSubmit={onCheckOneTeacher}
							/>
							{/* */}
							<CheckManyEmptyTeacher
								isLoading={isLoading}
								optionList={optionList}
								handleFetchTeacher={fetchTeacherByBranchID}
								handleSubmit={onCheckEmptyManyTeacher}
							/>
						</div>
					}
				>
					<Spin size="large" spinning={isLoading.type === 'ADD_DATA' && isLoading.status}>
						{infoSearch && (
							<h4 className="font-weight-black mb-3">
								{infoSearch.title && `[${infoSearch.title}]`}
								{infoSearch.branchName && `[${infoSearch.branchName}]`}
								{infoSearch.teacherName && `[${infoSearch.teacherName}]`}
								{infoSearch.roomName && `[${infoSearch.roomName}]`} | {infoSearch.fromDate} - {infoSearch.toDate}
							</h4>
						)}
						{dataList.type === 'CheckBranch' || dataList.type === 'CheckManyTeacher' ? (
							<ScheduleStudyList dataSource={fmList(dataList.type, dataList.list)} />
						) : (
							<CDCalendar isLoaded={true} isGetRecordList={true} eventList={calendarFm(dataList.list)} />
						)}
					</Spin>
				</Card>
			</div>
		</div>
	);
};
export default ScheduleStudy;
