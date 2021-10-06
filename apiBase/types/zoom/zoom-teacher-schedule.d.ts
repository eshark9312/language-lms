type IScheduleZoom = {
	ID: number;
	ButtonID: number;
	ButtonName: string;
	FinishZoom: boolean;
	ZoomRoomScheduleID: number;
	ZoomRoomID: string;
	ZoomRoomPass: string;
	IsRoomStart: boolean;
	CourseID: number;
	Title: string;
	BranchID: number;
	BranchName: string;
	RoomID: number;
	RoomName: string;
	SubjectID: number;
	SubjectName: string;
	StartTime: string;
	EndTime: string;
	SignatureTeacher: string;
	SignatureStudent: string;
	ApiKey: string;
	UserName: string;
	IsOff: true;
};

type IScheduleZoomDetail = {
	ID: number;
	CourseID: number;
	SubjectID: number;
	CurriculumsDetailID: number;
	StudyTimeID: number;
	BranchID: number;
	RoomID: number;
	Date: string;
	TeacherID: number;
	TeacherAttendanceID: number;
	ZoomRoomScheduleID: number;
	ZoomRoomID: string;
	ZoomRoomPass: string;
	SignatureTeacher: string;
	SignatureStudent: string;
	ApiKey: string;
	IsRoomStart: boolean;
	Status: number;
	ButtonID: number;
	ButtonName: string;
	FinishZoom: false;
};
