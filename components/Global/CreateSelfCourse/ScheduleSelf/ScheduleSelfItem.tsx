import { yupResolver } from '@hookform/resolvers/yup';
import { Collapse } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import SelectField from '~/components/FormControl/SelectField';
import { optionCommonPropTypes } from '~/utils/proptypes';
const { Panel } = Collapse;

const ScheduleSelfItem = (props) => {
	const {
		handleChangeStatusSchedule,
		handleChangeValueSchedule,
		//
		scheduleObj,
		isLoading,
		isUpdate,
		//
		optionTeacherList,
		optionStudyTime
	} = props;
	const { ID, SubjectName, TeacherName, Date } = scheduleObj as ISelfCourseSchedule;
	const defaultValuesInit = {
		TeacherID: 0,
		StudyTimeID: 0
	};
	const schema = yup.object().shape({
		StudyTimeID: yup.number().min(1, 'Bạn cần chọn ca học').required('Bạn không được để trống'),
		TeacherID: yup.number().min(1, 'Bạn cần chọn giáo viên').required('Bạn không được để trống')
	});

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
		mode: 'all'
	});

	const checkHandleChangeStatusSchedule = (vl, type) => {
		if (!handleChangeStatusSchedule) return;
		handleChangeStatusSchedule(vl, type);
	};
	const checkHandleChangeValueSchedule = (uid, key, vl) => {
		if (!handleChangeValueSchedule) return;
		handleChangeValueSchedule(uid, key, vl);
	};
	const setSiblingsFieldToDefault = () => {
		form.setValue('TeacherID', 0);
	};

	// CHECK IF VALUE DO NOT IN THE SELECT => CHANGE VALUE TO DEFAULT (0)
	useEffect(() => {
		form.clearErrors();
		if (isLoading.type === 'CHECK_SCHEDULE' && !isLoading.status) {
			let { ID, TeacherID, CaID, StudyTimeID } = scheduleObj;
			if (optionTeacherList.length) {
				form.setValue('StudyTimeID', CaID || StudyTimeID);
				// NEED TO SET SELECT TEACHER TO DEFAULT IF DONT HAVE VALUE FROM API RETURN
				if (!optionTeacherList.some((o) => o.value === TeacherID)) {
					form.setValue('TeacherID', 0);
					checkHandleChangeValueSchedule(ID, 'TeacherID', 0);
				} else {
					form.setValue('TeacherID', TeacherID);
				}
			}
		}
	}, [scheduleObj, optionTeacherList, isLoading]);

	return (
		<Panel
			{...props}
			header={
				<div className="info-course-item">
					<Checkbox
						onChange={() => {
							if (isUpdate) {
								// remove schedule from unavailable list
								// add schedule to available list
								checkHandleChangeStatusSchedule(scheduleObj, 2);
							} else {
								// remove schedule from available list
								// add schedule to unavailable list
								checkHandleChangeStatusSchedule(scheduleObj, 1);
							}
						}}
						checked={isUpdate}
					/>
					<p className="title">Buổi học tự sắp xếp</p>
					<ul className="info-course-list">
						<li>{SubjectName || 'Tên môn học'}</li>
					</ul>
				</div>
			}
		>
			<div className="info-course-select">
				<div className="row">
					<div className="col-12">
						<SelectField
							form={form}
							name="StudyTimeID"
							placeholder="Chọn ca"
							optionList={optionStudyTime}
							onChangeSelect={(value) => {
								setSiblingsFieldToDefault();
								checkHandleChangeValueSchedule(ID, 'CaID', value);
							}}
						/>
					</div>
					<div className="col-12 mt-3">
						<SelectField
							form={form}
							name="TeacherID"
							isLoading={isLoading.type === 'CHECK_SCHEDULE' && isLoading.status}
							placeholder="Chọn giáo viên"
							optionList={optionTeacherList}
							onChangeSelect={(value) => {
								checkHandleChangeValueSchedule(ID, 'TeacherID', value);
							}}
						/>
					</div>
				</div>
			</div>
		</Panel>
	);
};
ScheduleSelfItem.propTypes = {
	handleChangeValueSchedule: PropTypes.func,
	handleChangeStatusSchedule: PropTypes.func,
	//
	scheduleObj: PropTypes.shape({
		ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		eventName: PropTypes.string,
		Tiet: PropTypes.shape({
			CurriculumsDetailID: PropTypes.number,
			CurriculumsDetailName: PropTypes.string,
			SubjectID: PropTypes.number
		}),
		TeacherID: PropTypes.number,
		TeacherName: PropTypes.string,
		CaID: PropTypes.number,
		CaName: PropTypes.string,
		StudyTimeID: PropTypes.number,
		SubjectName: PropTypes.string,
		Date: PropTypes.string
	}),
	isUpdate: PropTypes.bool,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	//
	optionTeacherList: optionCommonPropTypes,
	optionStudyTime: optionCommonPropTypes
};
ScheduleSelfItem.defaultProps = {
	handleChangeValueSchedule: null,
	handleChangeStatusSchedule: null,
	//
	scheduleObj: {},
	isUpdate: false,
	isLoading: { type: '', status: false },
	positionInScheduleList: null,
	//
	optionTeacherList: [],
	optionStudyTime: []
};
export default ScheduleSelfItem;
