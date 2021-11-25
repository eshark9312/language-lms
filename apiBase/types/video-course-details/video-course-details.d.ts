import { data } from '~/lib/customer-student/data';
type IVideoCourseDetails = IBaseApi<{
	VideoCourseID: number;
	VideoCourseName: string;
	Slogan: string;
	Requirements: string;
	Description: string;
	ResultsAchieved: string;
	CourseForObject: string;
	TotalRating: number;
	RatingNumber: number;
	TotalStudent: number;
	CourseInFo: any;
	Title: string;
	IsPreview: boolean;
	SecondVideo: number;
}>;
